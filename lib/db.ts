import Dexie, { type Table } from 'dexie';

export interface Match {
  id?: number;
  date: Date;
  opponent?: string;
  format: 'best-of-3' | '8-game-pro' | 'tiebreak-set';
  score: string;
  won: boolean;
  surface: 'hard' | 'clay' | 'indoor';
  composure: number;
  firstServe?: number;
  doubleFaults?: number;
  strengths: string[];
  weaknesses: string[];
  notes?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  sourcePage: string;
  ease: number;
  interval: number;
  nextReview: Date;
  repetitions: number;
}

export interface DrillLog {
  id?: number;
  date: Date;
  drill: string;
  sourcePage: string;
  duration: number;
  notes?: string;
}

export interface Settings {
  key: string;
  value: string | number | boolean;
}

class TennisDB extends Dexie {
  matches!: Table<Match>;
  flashcards!: Table<Flashcard>;
  drillLogs!: Table<DrillLog>;
  settings!: Table<Settings>;

  constructor() {
    super('tennis-lab');
    this.version(1).stores({
      matches: '++id, date, won, surface',
      flashcards: 'id, sourcePage, nextReview',
      drillLogs: '++id, date, drill',
      settings: 'key',
    });
  }
}

export const db = new TennisDB();
