export interface ServePlacement {
  winPercentage: number;
  description: string;
  servePlusOne: string;
  strategyLink: string;
}

export type ServeTarget = "T" | "body" | "wide";
export type CourtSide = "deuce" | "ad";
export type ServeType = "flat" | "slice" | "kick";

/**
 * ATP-informed win percentage baselines:
 *   body  ~74%  — jams the returner, forces a weak reply
 *   T     ~71%  — ace opportunity, opens the court
 *   wide  ~68%  — pulls opponent off court, creates angle
 *
 * Values vary ±3–5% by serve type and court side.
 */
export const SERVE_DATA: Record<
  CourtSide,
  Record<ServeTarget, Record<ServeType, ServePlacement>>
> = {
  deuce: {
    T: {
      flat: {
        winPercentage: 71,
        description: "Ace opportunity down the T",
        servePlusOne: "Forehand to open court",
        strategyLink: "/strategy",
      },
      slice: {
        winPercentage: 69,
        description: "Pulls opponent off court",
        servePlusOne: "Inside-out forehand",
        strategyLink: "/strategy",
      },
      kick: {
        winPercentage: 68,
        description: "High kick to backhand",
        servePlusOne: "Approach on short reply",
        strategyLink: "/strategy",
      },
    },
    body: {
      flat: {
        winPercentage: 74,
        description: "Jams the returner",
        servePlusOne: "Attack weak return",
        strategyLink: "/advanced",
      },
      slice: {
        winPercentage: 73,
        description: "Curves into the body",
        servePlusOne: "Net rush on pushed return",
        strategyLink: "/advanced",
      },
      kick: {
        winPercentage: 72,
        description: "High kicker into the hip",
        servePlusOne: "Forehand winner down the line",
        strategyLink: "/advanced",
      },
    },
    wide: {
      flat: {
        winPercentage: 67,
        description: "Wide flat to stretch the returner",
        servePlusOne: "Open court forehand",
        strategyLink: "/strategy",
      },
      slice: {
        winPercentage: 70,
        description: "Slice curves sharply away",
        servePlusOne: "Inside-in forehand to open court",
        strategyLink: "/strategy",
      },
      kick: {
        winPercentage: 66,
        description: "Kick wide to the backhand",
        servePlusOne: "Close the net on reply",
        strategyLink: "/strategy",
      },
    },
  },
  ad: {
    T: {
      flat: {
        winPercentage: 70,
        description: "Flat T on the ad side to the forehand",
        servePlusOne: "Backhand crosscourt to open court",
        strategyLink: "/strategy",
      },
      slice: {
        winPercentage: 68,
        description: "Slice hugs the center line",
        servePlusOne: "Inside-out backhand",
        strategyLink: "/strategy",
      },
      kick: {
        winPercentage: 67,
        description: "Kick T jams into the body",
        servePlusOne: "Forehand to deuce corner",
        strategyLink: "/strategy",
      },
    },
    body: {
      flat: {
        winPercentage: 75,
        description: "Flat body serve jams left-handers",
        servePlusOne: "Attack the weak pop-up",
        strategyLink: "/advanced",
      },
      slice: {
        winPercentage: 74,
        description: "Slice into the body on ad side",
        servePlusOne: "Volley or put-away on weak return",
        strategyLink: "/advanced",
      },
      kick: {
        winPercentage: 73,
        description: "Kick up into the shoulder",
        servePlusOne: "Exploit high return with topspin",
        strategyLink: "/advanced",
      },
    },
    wide: {
      flat: {
        winPercentage: 68,
        description: "Wide flat pulls returner off court",
        servePlusOne: "Forehand down the line",
        strategyLink: "/strategy",
      },
      slice: {
        winPercentage: 71,
        description: "Slice curves wide to the forehand",
        servePlusOne: "Open-court backhand winner",
        strategyLink: "/strategy",
      },
      kick: {
        winPercentage: 67,
        description: "Kick wide creates extreme angle",
        servePlusOne: "Net approach on short return",
        strategyLink: "/strategy",
      },
    },
  },
};
