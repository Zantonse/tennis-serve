export interface Grip {
  bevel: number;
  name: string;
  alternateNames: string[];
  bestFor: string[];
  faceAngle: number; // degrees from perpendicular (0 = square)
  description: string;
  relatedPages: { title: string; href: string }[];
}

export const GRIPS: Grip[] = [
  {
    bevel: 2,
    name: "Continental",
    alternateNames: ["Chopper grip", "Hammer grip"],
    bestFor: ["serve", "volley", "slice", "overhead"],
    faceAngle: 0,
    description:
      "The foundation grip for serve-and-volley players. The base knuckle of the index finger sits on bevel 2, keeping the racket face perpendicular at contact. Essential for all serve types, volleys, slices, and overheads — it allows the wrist to naturally pronate through the swing.",
    relatedPages: [
      { title: "Grip Guide", href: "/grips" },
      { title: "Technique", href: "/technique" },
      { title: "Serve Types", href: "/serve-types" },
    ],
  },
  {
    bevel: 3,
    name: "Eastern Forehand",
    alternateNames: ["Eastern grip"],
    bestFor: ["flat forehands", "approach shots"],
    faceAngle: 0,
    description:
      "The base knuckle sits on bevel 3, as if you laid the racket flat and picked it up by the handle. Ideal for flat or mildly topspin forehands and approach shots. Produces a square face at contact, making it forgiving and great for lower balls.",
    relatedPages: [
      { title: "Grip Guide", href: "/grips" },
      { title: "Groundstrokes", href: "/groundstrokes" },
    ],
  },
  {
    bevel: 4,
    name: "Semi-Western Forehand",
    alternateNames: ["Semi-Western"],
    bestFor: ["topspin forehands", "modern baseline play"],
    faceAngle: -15,
    description:
      "The most popular forehand grip on today's ATP and WTA tours. The base knuckle rests on bevel 4, rotating the hand slightly underneath the handle. This naturally closes the racket face at contact and drives the low-to-high swing path that generates heavy topspin.",
    relatedPages: [
      { title: "Grip Guide", href: "/grips" },
      { title: "Groundstrokes", href: "/groundstrokes" },
    ],
  },
  {
    bevel: 5,
    name: "Western Forehand",
    alternateNames: ["Full Western", "Extreme Western"],
    bestFor: ["heavy topspin", "clay court play"],
    faceAngle: -30,
    description:
      "An extreme grip where the base knuckle sits on bevel 5, rotating the hand well under the handle. The racket face is significantly closed at setup, demanding a very steep low-to-high swing to generate massive topspin. Highly effective on high-bouncing clay courts but difficult on low balls.",
    relatedPages: [
      { title: "Grip Guide", href: "/grips" },
      { title: "Groundstrokes", href: "/groundstrokes" },
    ],
  },
  {
    bevel: 1,
    name: "Eastern Backhand",
    alternateNames: ["Eastern backhand grip"],
    bestFor: ["one-handed backhand"],
    faceAngle: 0,
    description:
      "The standard grip for one-handed backhand players. The base knuckle sits on bevel 1 (the top bevel), placing the thumb knuckle behind the handle for support. Produces a clean, flat-to-topspin backhand and allows good slice with minimal grip change.",
    relatedPages: [
      { title: "Grip Guide", href: "/grips" },
      { title: "Groundstrokes", href: "/groundstrokes" },
    ],
  },
  {
    bevel: 2.5, // represents 2 (dominant hand) + 3/4 (non-dominant hand)
    name: "Two-Handed Backhand",
    alternateNames: ["Two-handed grip", "Double-handed backhand"],
    bestFor: ["two-handed backhand"],
    faceAngle: 0,
    description:
      "The dominant hand uses a Continental grip (bevel 2) while the non-dominant hand overlaps in a Semi-Western or Eastern Forehand position (bevel 3–4). The second hand provides stability and extra power, making it the most common backhand grip for recreational and touring players alike.",
    relatedPages: [
      { title: "Grip Guide", href: "/grips" },
      { title: "Groundstrokes", href: "/groundstrokes" },
    ],
  },
];
