import { type Match } from '@/lib/db';
import { TAG_MAP } from '@/lib/tags';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Insight {
  type: 'warning' | 'positive' | 'neutral';
  title: string;
  body: string;
  links: { title: string; href: string }[];
}

// ---------------------------------------------------------------------------
// 1. getStats
// ---------------------------------------------------------------------------

export function getStats(matches: Match[]): {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  avgComposure: number;
  avgFirstServe: number;
} {
  const total = matches.length;
  if (total === 0) {
    return { total: 0, wins: 0, losses: 0, winRate: 0, avgComposure: 0, avgFirstServe: 0 };
  }

  const wins = matches.filter((m) => m.won).length;
  const losses = total - wins;
  const winRate = (wins / total) * 100;

  const avgComposure =
    matches.reduce((sum, m) => sum + m.composure, 0) / total;

  const firstServeMatches = matches.filter((m) => m.firstServe !== undefined);
  const avgFirstServe =
    firstServeMatches.length > 0
      ? firstServeMatches.reduce((sum, m) => sum + (m.firstServe as number), 0) /
        firstServeMatches.length
      : 0;

  return { total, wins, losses, winRate, avgComposure, avgFirstServe };
}

// ---------------------------------------------------------------------------
// 2. getTagFrequency
// ---------------------------------------------------------------------------

export function getTagFrequency(
  matches: Match[],
  type: 'strengths' | 'weaknesses',
): { tag: string; count: number; percentage: number }[] {
  const total = matches.length;
  if (total === 0) return [];

  const counts: Record<string, number> = {};
  for (const m of matches) {
    const tags = m[type];
    for (const tag of tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Helper: parse a score string into set pairs [playerGames, opponentGames]
// Handles "6-4 7-5", "6-4 6-7(5) 7-6(3)", etc.
// ---------------------------------------------------------------------------

function parseSets(score: string): [number, number][] {
  const setPattern = /(\d+)-(\d+)(?:\(\d+\))?/g;
  const sets: [number, number][] = [];
  let found: RegExpExecArray | null = setPattern.exec(score);
  while (found !== null) {
    sets.push([parseInt(found[1], 10), parseInt(found[2], 10)]);
    found = setPattern.exec(score);
  }
  return sets;
}

// ---------------------------------------------------------------------------
// 3. getInsights
// ---------------------------------------------------------------------------

export function getInsights(matches: Match[]): Insight[] {
  const insights: Insight[] = [];
  const total = matches.length;
  if (total === 0) return insights;

  // --- Weakness tag > 40% -> warning ---
  const weakFreq = getTagFrequency(matches, 'weaknesses');
  for (const { tag, percentage } of weakFreq) {
    if (percentage > 40) {
      const mapping = TAG_MAP[tag];
      insights.push({
        type: 'warning',
        title: `Recurring weakness: ${mapping?.label ?? tag}`,
        body: `"${mapping?.label ?? tag}" appeared as a weakness in ${percentage.toFixed(0)}% of your matches. Focus on this area to improve your overall game.`,
        links: mapping?.contentPages ?? [],
      });
    }
  }

  // --- Composure drop in 3-set matches ---
  const threeSetMatches = matches.filter((m) => parseSets(m.score).length === 3);
  if (threeSetMatches.length >= 3) {
    const composureIn3Set =
      threeSetMatches.reduce((sum, m) => sum + m.composure, 0) /
      threeSetMatches.length;
    const overallComposure =
      matches.reduce((sum, m) => sum + m.composure, 0) / total;
    if (composureIn3Set < overallComposure - 0.5) {
      insights.push({
        type: 'warning',
        title: 'Composure drops in 3-set matches',
        body: `Your average composure in 3-set matches (${composureIn3Set.toFixed(1)}) is lower than your overall average (${overallComposure.toFixed(1)}). Work on staying mentally sharp in long matches.`,
        links: TAG_MAP['composure']?.contentPages ?? [],
      });
    }
  }

  // --- Tiebreak record ---
  let tiebreakWins = 0;
  let tiebreakLosses = 0;
  for (const m of matches) {
    for (const [p, o] of parseSets(m.score)) {
      if (p === 7 && o === 6) tiebreakWins++;
      if (p === 6 && o === 7) tiebreakLosses++;
    }
  }
  const tiebreakTotal = tiebreakWins + tiebreakLosses;
  if (tiebreakTotal > 0) {
    const tbWinRate = ((tiebreakWins / tiebreakTotal) * 100).toFixed(0);
    const isGood = tiebreakWins >= tiebreakLosses;
    insights.push({
      type: isGood ? 'positive' : 'warning',
      title: `Tiebreak record: ${tiebreakWins}-${tiebreakLosses}`,
      body: `You have played ${tiebreakTotal} tiebreak${tiebreakTotal !== 1 ? 's' : ''} with a ${tbWinRate}% win rate. ${isGood ? 'Your tiebreak performance is solid.' : 'Tiebreaks are an area to improve.'}`,
      links: TAG_MAP['tiebreaks']?.contentPages ?? [],
    });
  }

  // --- Strength tag > 60% -> positive ---
  const strengthFreq = getTagFrequency(matches, 'strengths');
  for (const { tag, percentage } of strengthFreq) {
    if (percentage > 60) {
      const mapping = TAG_MAP[tag];
      insights.push({
        type: 'positive',
        title: `Reliable weapon: ${mapping?.label ?? tag}`,
        body: `"${mapping?.label ?? tag}" is a consistent strength, appearing in ${percentage.toFixed(0)}% of your matches. Keep leveraging it.`,
        links: mapping?.contentPages ?? [],
      });
    }
  }

  // --- Momentum: last 5 win rate vs overall ---
  if (total >= 5) {
    // matches sorted date desc (newest first) per spec
    const last5 = matches.slice(0, 5);
    const last5Wins = last5.filter((m) => m.won).length;
    const last5WinRate = (last5Wins / 5) * 100;
    const overallWinRate = (matches.filter((m) => m.won).length / total) * 100;
    if (last5WinRate > overallWinRate) {
      insights.push({
        type: 'positive',
        title: 'Positive momentum',
        body: `Your win rate in the last 5 matches (${last5WinRate.toFixed(0)}%) is above your overall win rate (${overallWinRate.toFixed(0)}%). You are trending upward.`,
        links: [],
      });
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// 4. getRecommendations
// ---------------------------------------------------------------------------

export function getRecommendations(matches: Match[]): {
  tag: string;
  label: string;
  contentPages: { title: string; href: string }[];
  drills: { name: string; href: string }[];
}[] {
  // Work from the last 5 matches (newest first per spec)
  const recent = matches.slice(0, 5);
  if (recent.length === 0) return [];

  const weakFreq = getTagFrequency(recent, 'weaknesses');
  const top3 = weakFreq.slice(0, 3);

  return top3.map(({ tag }) => {
    const mapping = TAG_MAP[tag];
    return {
      tag,
      label: mapping?.label ?? tag,
      contentPages: mapping?.contentPages ?? [],
      drills: mapping?.drills ?? [],
    };
  });
}

// ---------------------------------------------------------------------------
// 5. getStreaks
// ---------------------------------------------------------------------------

export function getStreaks(matches: Match[]): {
  currentWinStreak: number;
  currentLossStreak: number;
  bestWinStreak: number;
  bestLossStreak: number;
} {
  if (matches.length === 0) {
    return { currentWinStreak: 0, currentLossStreak: 0, bestWinStreak: 0, bestLossStreak: 0 };
  }

  // Current streaks from most recent match (matches sorted date desc)
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  let idx = 0;
  while (idx < matches.length && matches[idx].won) {
    currentWinStreak++;
    idx++;
  }
  idx = 0;
  while (idx < matches.length && !matches[idx].won) {
    currentLossStreak++;
    idx++;
  }

  // Best streaks — scan full history oldest to newest
  let bestWinStreak = 0;
  let bestLossStreak = 0;
  let runWin = 0;
  let runLoss = 0;

  const chronological = [...matches].reverse();
  for (const m of chronological) {
    if (m.won) {
      runWin++;
      runLoss = 0;
    } else {
      runLoss++;
      runWin = 0;
    }
    if (runWin > bestWinStreak) bestWinStreak = runWin;
    if (runLoss > bestLossStreak) bestLossStreak = runLoss;
  }

  return { currentWinStreak, currentLossStreak, bestWinStreak, bestLossStreak };
}

// ---------------------------------------------------------------------------
// 6. getSeasonStats
// ---------------------------------------------------------------------------

function getMonthLabel(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${mo}`;
}

function getQuarterLabel(date: Date): string {
  const y = date.getFullYear();
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `Q${q} ${y}`;
}

function parseQuarterLabel(label: string): [number, number] {
  // "Q3 2025" -> [3, 2025]
  const parts = label.split(' ');
  const q = parseInt(parts[0].slice(1), 10);
  const y = parseInt(parts[1], 10);
  return [q, y];
}

function comparePeriodLabels(
  a: string,
  b: string,
  period: 'month' | 'quarter',
): number {
  if (period === 'month') {
    // "YYYY-MM" — lexicographic sort is correct
    return a < b ? -1 : a > b ? 1 : 0;
  }
  // "Q1 YYYY"
  const [qa, ya] = parseQuarterLabel(a);
  const [qb, yb] = parseQuarterLabel(b);
  if (ya !== yb) return ya - yb;
  return qa - qb;
}

export function getSeasonStats(
  matches: Match[],
  period: 'month' | 'quarter',
): {
  label: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  avgComposure: number;
}[] {
  if (matches.length === 0) return [];

  const grouped: Record<string, Match[]> = {};

  for (const m of matches) {
    const label =
      period === 'month'
        ? getMonthLabel(new Date(m.date))
        : getQuarterLabel(new Date(m.date));
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(m);
  }

  const result = Object.entries(grouped).map(([label, group]) => {
    const total = group.length;
    const wins = group.filter((m) => m.won).length;
    const losses = total - wins;
    const winRate = (wins / total) * 100;
    const avgComposure = group.reduce((sum, m) => sum + m.composure, 0) / total;
    return { label, matches: total, wins, losses, winRate, avgComposure };
  });

  result.sort((a, b) => comparePeriodLabels(a.label, b.label, period));

  return result;
}
