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
    label: "Science",
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
    label: "Application",
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
        title: "Training & Drills",
        href: "/training",
        icon: "dumbbell",
        description: "Progressive drills and practice protocols",
      },
      {
        title: "Recovery",
        href: "/recovery",
        icon: "heart",
        description: "Shoulder health, fatigue management, and injury prevention",
      },
      {
        title: "Recovery & Sleep",
        href: "/recovery-sleep",
        icon: "moon",
        description: "Sleep science, active recovery, nutrition, and injury prevention",
      },
    ],
  },
  {
    label: "Mental",
    items: [
      {
        title: "Mental Game",
        href: "/mental-game",
        icon: "brain",
        description: "Focus, pressure, self-talk, and match mindset",
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
  "/biomechanics",
  "/technique",
  "/serve-types",
  "/strategy",
  "/advanced",
  "/returns",
  "/doubles",
  "/footwork",
  "/footwork-drills",
  "/conditioning",
  "/training",
  "/recovery",
  "/recovery-sleep",
  "/mental-game",
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
