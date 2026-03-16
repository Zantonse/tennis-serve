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
  "/training",
  "/recovery",
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
