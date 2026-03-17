export interface NavItem {
  title: string;
  href: string;
  icon: string;
  description: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Start Here",
    items: [
      {
        title: "Learn the Serve",
        href: "/learn",
        icon: "crosshair",
        description: "Step-by-step walkthrough",
      },
      {
        title: "Self-Assessment",
        href: "/assess",
        icon: "crosshair",
        description: "Film and check your serve",
      },
    ],
  },
  {
    label: "Fundamentals",
    items: [
      {
        title: "Grip Guide",
        href: "/grips",
        icon: "tool",
        description: "Every grip for every shot — bevels, changes, and pressure",
      },
      {
        title: "Groundstrokes",
        href: "/groundstrokes",
        icon: "target",
        description: "Forehand, backhand, and slice technique",
      },
    ],
  },
  {
    label: "The Serve",
    items: [
      {
        title: "Biomechanics",
        href: "/biomechanics",
        icon: "activity",
        description: "Kinetic chain, joint forces, and power generation",
      },
      {
        title: "Technique",
        href: "/technique",
        icon: "target",
        description: "Trophy position, contact point, and swing path",
      },
      {
        title: "Serve Types",
        href: "/serve-types",
        icon: "layers",
        description: "Flat, slice, kick, and topspin variations",
      },
    ],
  },
  {
    label: "Body Mechanics",
    items: [
      {
        title: "Upper Body",
        href: "/upper-body",
        icon: "target",
        description: "Shoulder, arm path, wrist action across all strokes",
      },
      {
        title: "Lower Body",
        href: "/lower-body",
        icon: "target",
        description: "Stance, leg drive, hip rotation, and GRF",
      },
      {
        title: "Full-Body Integration",
        href: "/full-body-integration",
        icon: "target",
        description: "Core transfer, kinetic chain timing, and the whip effect",
      },
      {
        title: "Momentum & Force",
        href: "/momentum-force",
        icon: "zap",
        description: "Physics of power, spin, and energy transfer",
      },
    ],
  },
  {
    label: "Match Play",
    items: [
      {
        title: "Strategy & Tactics",
        href: "/strategy",
        icon: "map",
        description: "Placement, patterns, and match-play decisions",
      },
      {
        title: "Advanced Strategy",
        href: "/advanced",
        icon: "grid",
        description: "4.0→4.5 tactics and patterns",
      },
      {
        title: "Return of Serve",
        href: "/returns",
        icon: "lightning",
        description: "Positioning, technique, and tactics",
      },
      {
        title: "Doubles Strategy",
        href: "/doubles",
        icon: "grid",
        description: "Formations, poaching, communication",
      },
    ],
  },
  {
    label: "Movement & Fitness",
    items: [
      {
        title: "Footwork",
        href: "/footwork",
        icon: "zap",
        description: "Movement fundamentals and court coverage",
      },
      {
        title: "Footwork Drills",
        href: "/footwork-drills",
        icon: "zap",
        description: "Progressive drills for speed and agility",
      },
      {
        title: "Conditioning",
        href: "/conditioning",
        icon: "activity",
        description: "Fitness, strength, speed, and match endurance",
      },
      {
        title: "Serve Training",
        href: "/training",
        icon: "dumbbell",
        description: "Progressive serve drills and practice protocols",
      },
      {
        title: "Practice Planning",
        href: "/practice-planning",
        icon: "map",
        description: "Weekly structure, 12-week cycles, and progress tracking",
      },
    ],
  },
  {
    label: "Mind & Recovery",
    items: [
      {
        title: "Mental Game",
        href: "/mental-game",
        icon: "brain",
        description: "Focus, pressure, self-talk, and match mindset",
      },
      {
        title: "Serve Recovery",
        href: "/recovery",
        icon: "heart",
        description: "Shoulder health, fatigue management, and injury prevention",
      },
      {
        title: "Recovery & Sleep",
        href: "/recovery-sleep",
        icon: "moon",
        description: "Sleep science, nutrition, active recovery, and injury prevention",
      },
    ],
  },
  {
    label: "My Tennis",
    items: [
      {
        title: "Match Log",
        href: "/match-log",
        icon: "edit",
        description: "Log matches and track your progress",
      },
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "bar-chart",
        description: "Pattern insights and recommendations",
      },
      {
        title: "Trends",
        href: "/trends",
        icon: "trending-up",
        description: "Win rate, composure, and serve trends",
      },
      {
        title: "Season Overview",
        href: "/season",
        icon: "calendar",
        description: "Monthly stats, streaks, and improvement areas",
      },
    ],
  },
  {
    label: "Interactive Tools",
    items: [
      {
        title: "Spin Visualizer",
        href: "/spin-viz",
        icon: "eye",
        description: "3D ball flight with spin physics",
      },
      {
        title: "Serve Simulator",
        href: "/serve-sim",
        icon: "crosshair",
        description: "Placement zones and serve+1 patterns",
      },
      {
        title: "Grip Explorer",
        href: "/grip-explorer",
        icon: "hand",
        description: "Interactive handle with grip info",
      },
      {
        title: "Power Calculator",
        href: "/power-calc",
        icon: "zap",
        description: "Racket speed to ball speed physics",
      },
      {
        title: "Chain Sequencer",
        href: "/chain-seq",
        icon: "layers",
        description: "Kinetic chain timing visualizer",
      },
    ],
  },
  {
    label: "Court-Side",
    items: [
      {
        title: "Drill Timer",
        href: "/drill-timer",
        icon: "clock",
        description: "Guided intervals with audio cues",
      },
      {
        title: "Serve Randomizer",
        href: "/serve-random",
        icon: "target",
        description: "Random serve targets with streak tracking",
      },
      {
        title: "Routine Timer",
        href: "/routine-timer",
        icon: "activity",
        description: "Between-point 4-phase routine",
      },
      {
        title: "Warm-Up",
        href: "/warmup",
        icon: "zap",
        description: "Guided pre-match warm-up flow",
      },
      {
        title: "Flashcards",
        href: "/flashcards",
        icon: "book",
        description: "Spaced repetition technique cues",
      },
      {
        title: "Quick Reference",
        href: "/quick-ref",
        icon: "list",
        description: "Key cues for court-side glancing",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Video Library",
        href: "/videos",
        icon: "play-circle",
        description: "Annotated slow-motion and match footage",
      },
      {
        title: "Equipment",
        href: "/equipment",
        icon: "tool",
        description: "Racquet specs, strings, and ball selection",
      },
    ],
  },
];

export const pageOrder: string[] = [
  "/learn",
  "/assess",
  "/grips",
  "/groundstrokes",
  "/biomechanics",
  "/technique",
  "/serve-types",
  "/upper-body",
  "/lower-body",
  "/full-body-integration",
  "/momentum-force",
  "/strategy",
  "/advanced",
  "/returns",
  "/doubles",
  "/footwork",
  "/footwork-drills",
  "/conditioning",
  "/training",
  "/practice-planning",
  "/mental-game",
  "/recovery",
  "/recovery-sleep",
  "/match-log",
  "/dashboard",
  "/trends",
  "/season",
  "/drill-timer",
  "/serve-random",
  "/routine-timer",
  "/warmup",
  "/flashcards",
  "/quick-ref",
  "/spin-viz",
  "/serve-sim",
  "/grip-explorer",
  "/power-calc",
  "/chain-seq",
  "/videos",
  "/equipment",
];

export interface PageNavResult {
  prev: NavItem | null;
  next: NavItem | null;
}

function findNavItem(href: string): NavItem | null {
  for (const group of navGroups) {
    const item = group.items.find((i) => i.href === href);
    if (item) return item;
  }
  return null;
}

export function getPageNav(currentPath: string): PageNavResult {
  const index = pageOrder.indexOf(currentPath);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const prevHref = index > 0 ? pageOrder[index - 1] : null;
  const nextHref = index < pageOrder.length - 1 ? pageOrder[index + 1] : null;

  return {
    prev: prevHref ? findNavItem(prevHref) : null,
    next: nextHref ? findNavItem(nextHref) : null,
  };
}

export interface BreadcrumbResult {
  group: string;
  page: string;
}

export function getBreadcrumb(currentPath: string): BreadcrumbResult {
  for (const group of navGroups) {
    const item = group.items.find((i) => i.href === currentPath);
    if (item) {
      return { group: group.label, page: item.title };
    }
  }
  return { group: "", page: "" };
}
