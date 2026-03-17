export interface CardState {
  ease: number;        // default 2.5, minimum 1.3
  interval: number;   // days until next review
  repetitions: number;
}

export interface ReviewResult extends CardState {
  nextReview: Date;
}

// Quality: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
export function calculateNextReview(
  quality: 0 | 1 | 2 | 3,
  card: CardState
): ReviewResult {
  let { ease, interval, repetitions } = card;

  switch (quality) {
    case 0: // Again — reset
      ease = Math.max(1.3, ease * 0.8);
      interval = 1;
      repetitions = 0;
      break;
    case 1: // Hard — small increase
      interval = Math.max(1, Math.round(interval * 1.2));
      // ease stays the same
      repetitions += 1;
      break;
    case 2: // Good — normal increase
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ease);
      }
      repetitions += 1;
      break;
    case 3: // Easy — big increase
      if (repetitions === 0) {
        interval = 4;
      } else {
        interval = Math.round(interval * ease * 1.3);
      }
      ease = Math.min(3.0, ease + 0.1);
      repetitions += 1;
      break;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { ease, interval, repetitions, nextReview };
}
