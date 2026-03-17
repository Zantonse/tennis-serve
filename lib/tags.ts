export interface TagMapping {
  label: string;
  contentPages: { title: string; href: string }[];
  drills: { name: string; href: string }[];
}

export const TAG_MAP: Record<string, TagMapping> = {
  forehand: {
    label: 'Forehand',
    contentPages: [{ title: 'Groundstrokes', href: '/groundstrokes' }],
    drills: [
      { name: 'Cross-Court 20', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
      { name: 'Speed Ladder Rally', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
    ],
  },
  backhand: {
    label: 'Backhand',
    contentPages: [{ title: 'Groundstrokes', href: '/groundstrokes' }],
    drills: [
      { name: 'Backhand cross-court game', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
      { name: 'Figure-8', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
    ],
  },
  firstServe: {
    label: 'First Serve',
    contentPages: [
      { title: 'Technique', href: '/technique' },
      { title: 'Serve Types', href: '/serve-types' },
    ],
    drills: [
      { name: 'Target practice', href: '/training' },
    ],
  },
  secondServe: {
    label: 'Second Serve',
    contentPages: [{ title: 'Serve Types', href: '/serve-types' }],
    drills: [
      { name: 'Pressure serve drill', href: '/training' },
    ],
  },
  return: {
    label: 'Return of Serve',
    contentPages: [{ title: 'Return of Serve', href: '/returns' }],
    drills: [
      { name: 'Serve Return Reaction', href: '/footwork-drills' },
    ],
  },
  netGame: {
    label: 'Net Game',
    contentPages: [{ title: 'Upper Body (volley section)', href: '/upper-body' }],
    drills: [
      { name: 'Approach-Split-Volley', href: '/footwork-drills' },
    ],
  },
  footwork: {
    label: 'Footwork',
    contentPages: [{ title: 'Footwork', href: '/footwork' }],
    drills: [
      { name: 'X-Drill', href: '/footwork-drills' },
      { name: 'Fan Drill', href: '/footwork-drills' },
    ],
  },
  composure: {
    label: 'Composure',
    contentPages: [{ title: 'Mental Game', href: '/mental-game' }],
    drills: [
      { name: 'Between-point routine', href: '/mental-game' },
      { name: 'Pressure games', href: '/mental-game' },
    ],
  },
  shotSelection: {
    label: 'Shot Selection',
    contentPages: [{ title: 'Strategy & Tactics', href: '/strategy' }],
    drills: [
      { name: '3-shot pattern drill', href: '/groundstrokes' },
    ],
  },
  consistency: {
    label: 'Consistency',
    contentPages: [{ title: 'Groundstrokes', href: '/groundstrokes' }],
    drills: [
      { name: 'Deep Zone Rally', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
      { name: 'Cross-Court 20', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
    ],
  },
  tiebreaks: {
    label: 'Tiebreaks',
    contentPages: [{ title: 'Mental Game', href: '/mental-game' }],
    drills: [
      { name: 'First-to-7 tiebreak practice', href: '/mental-game' },
    ],
  },
  bigPoints: {
    label: 'Big Points',
    contentPages: [{ title: 'Mental Game', href: '/mental-game' }],
    drills: [
      { name: 'Must-win games', href: '/mental-game' },
      { name: 'Consequence games', href: '/mental-game' },
    ],
  },
  depth: {
    label: 'Depth',
    contentPages: [
      { title: 'Groundstrokes', href: '/groundstrokes' },
      { title: 'Momentum & Force', href: '/momentum-force' },
    ],
    drills: [
      { name: 'Deep Zone Rally', href: '/groundstrokes#5-practice-drills-for-groundstrokes' },
    ],
  },
  aggression: {
    label: 'Aggression',
    contentPages: [{ title: 'Advanced Strategy', href: '/advanced' }],
    drills: [
      { name: 'First-Strike Drill', href: '/groundstrokes' },
    ],
  },
  patience: {
    label: 'Patience',
    contentPages: [{ title: 'Strategy & Tactics', href: '/strategy' }],
    drills: [
      { name: 'Rally construction', href: '/groundstrokes' },
    ],
  },
};

export const TAG_LABELS = Object.keys(TAG_MAP);
