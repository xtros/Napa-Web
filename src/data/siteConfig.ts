export type ModuleConfig = {
  enabled: boolean
  label: string
  detail?: string
  url?: string
  inviteCode?: string
  bedrockIp?: string
  bedrockPort?: string
}

export type TileConfig = {
  id: string
  title: string
  description: string
  cta: string
  theme: string
  size: "xl" | "lg" | "md" | "sm"
  layout: "full" | "wide" | "stackTop" | "stackBottom"
  badge?: string
  href?: string
  image?: {
    src: string
    alt: string
  }
  backgroundImage?: {
    src: string
    alt?: string
  }
  backgroundTint?: string
  backgroundOpacity?: number
  artSize?: "xs" | "sm" | "md" | "lg" | "xl" | "hero" | "mega"
}

export type RankProduct = {
  id: string
  name: string
  price: string
  accent: string
  badge?: string
  popular?: boolean
  focus: string
  joiningBonus: string
  weeklySalary: string
  multiplier: string
  perks: string[]
  ctaText?: string
  ctaHref?: string
  skinImage?: string
}

export type HighlightBadge = {
  tileId: string
  text: string
}

export type CocPerk = {
  title: string
  description: string
  badge: string
}

export type CocRequirement = {
  title: string
  description: string
  icon: string
}

export type CocConfig = {
  clanName: string
  clanTag: string
  clanLevel: string
  warFrequency: string
  cwlLeague: string
  capitalHall: string
  members: string
  requiredTownHall: string
  requiredTrophies: string
  description: string
  openLink: string
  discordChannelUrl: string
  perks: CocPerk[]
  requirements: CocRequirement[]
  roles: {
    role: string
    requirement: string
    color: string
  }[]
}

export const siteConfig = {
  brand: {
    name: "NAPA",
    tagline: "PLAY.NAPASMP.FUN",
    logo: {
      src: "/assets/branding/napa_logo.png",
      alt: "NAPA logo",
      width: 512,
      height: 512
    }
  },
  modules: {
    discord: {
      enabled: true,
      inviteCode: "napacommunity",
      label: "dsc.gg/napa",
      detail: "960+ members",
      url: "https://dsc.gg/napa"
    } as ModuleConfig,
    serverIp: {
      enabled: true,
      label: "play.napasmp.fun",
      detail: "Java & Bedrock • Online",
      bedrockIp: "bd.napasmp.fun",
      bedrockPort: "19132"
    } as ModuleConfig
  },
  badges: {
    highlight: {
      tileId: "home",
      text: "WELCOME"
    } as HighlightBadge
  },
  tiles: [
    {
      id: "home",
      title: "Home",
      description: "Welcome to NAPA SMP. Survival • Economy • PvP.",
      cta: "Explore Server",
      theme: "tile-purple",
      size: "xl",
      layout: "full",
      href: "/home",
      image: {
        src: "/assets/tiles/effects.png",
        alt: "NAPA SMP preview"
      },
      backgroundImage: {
        src: "/assets/tiles/courtyard_640x360.png",
        alt: "NAPA SMP background"
      },
      backgroundTint: "rgba(147, 51, 234, 0.75)",
      backgroundOpacity: 0.28,
      artSize: "mega"
    },
    {
      id: "ranks",
      title: "Ranks",
      description: "Unlock core perks and progression boosts.",
      cta: "Click to Browse",
      theme: "tile-gold",
      size: "lg",
      layout: "wide",
      href: "/ranks",
      image: {
        src: "/assets/tiles/ranks.png",
        alt: "Ranks preview"
      },
      backgroundImage: {
        src: "/assets/tiles/versus_640x360.png",
        alt: "Ranks background"
      },
      backgroundTint: "rgba(245, 196, 65, 0.72)",
      backgroundOpacity: 0.3,
      artSize: "hero"
    },
    {
      id: "server-status",
      title: "Server Status",
      description: "Live SMP status, online players & server stats.",
      cta: "View Players & Stats",
      theme: "tile-blue",
      size: "md",
      layout: "stackTop",
      href: "/status",
      image: {
        src: "/assets/tiles/upgrades_340x466.png",
        alt: "Server status preview"
      },
      backgroundImage: {
        src: "/assets/tiles/farms_640x360.png",
        alt: "Server status background"
      },
      backgroundTint: "rgba(63, 108, 246, 0.8)"
    },
    {
      id: "events",
      title: "Events",
      description: "Limited-time challenges and rewards.",
      cta: "Click to Browse",
      theme: "tile-green",
      size: "md",
      layout: "stackBottom",
      image: {
        src: "/assets/tiles/events_600x438.png",
        alt: "Events preview"
      },
      backgroundImage: {
        src: "/assets/tiles/farms_640x360.png",
        alt: "Events background"
      },
      backgroundTint: "rgba(43, 213, 127, 0.72)",
      backgroundOpacity: 0.3,
      artSize: "md"
    },
    {
      id: "discord",
      title: "Discord",
      description: "Join the community for updates and drops.",
      cta: "Join the Discord",
      theme: "tile-purple",
      size: "sm",
      layout: "full",
      href: "https://dsc.gg/napa",
      image: {
        src: "/assets/tiles/discord_340x466.png",
        alt: "Discord community preview"
      },
      backgroundImage: {
        src: "/assets/tiles/mines_640x360.png",
        alt: "Discord background"
      },
      backgroundTint: "rgba(63, 108, 246, 0.72)",
      backgroundOpacity: 0.28,
      artSize: "xs"
    }
  ] as TileConfig[],
  ranks: {
    headline: "Server Ranks & Economy Perks",
    description:
      "Unlock massive economy advantages on NAPA SMP with one-time joining bonuses, weekly salaries, shop sell multipliers, and expanded auction house limits.",
    products: [
      {
        id: "vip",
        name: "VIP",
        price: "80/-",
        accent: "rank-vip",
        badge: "STARTER",
        skinImage: "/assets/ranks/skin_vip_v2.png",
        focus: "A slight edge on daily income and trading convenience.",
        joiningBonus: "$5,000",
        weeklySalary: "$1,500/wk",
        multiplier: "1.10x (+10%)",
        perks: [
          "One-Time Joining Bonus: $5,000",
          "Weekly Salary: $1,500 / week (/salary or /kit money)",
          "Shop & Sell Multiplier: 1.10x (+10%) more money on /shop",
          "Auction House (/ah): 5 active listings (default is 3)",
          "Auction House: 4% listing tax (default is 5%)",
          "Jobs & Mob Killing: +5% bonus money per action"
        ]
      },
      {
        id: "mvp",
        name: "MVP",
        price: "250/-",
        accent: "rank-mvp",
        badge: "POPULAR",
        skinImage: "/assets/ranks/skin_mvp_v2.png",
        focus: "Higher passive earnings, noticeably better margins on trade and jobs.",
        joiningBonus: "$15,000",
        weeklySalary: "$4,000/wk",
        multiplier: "1.20x (+20%)",
        perks: [
          "One-Time Joining Bonus: $15,000",
          "Weekly Salary: $4,000 / week",
          "Shop & Sell Multiplier: 1.20x (+20%) more money on /shop",
          "Auction House (/ah): 10 active listings",
          "Auction House: 3% listing tax on trades",
          "Listing Duration: Up to 48 hours (default 24h)",
          "Jobs & Mob Killing: +10% bonus money per action",
          "Bank Storage: +10% higher max storage cap"
        ]
      },
      {
        id: "elite",
        name: "ELITE",
        price: "500/-",
        accent: "rank-elite",
        badge: "BEST VALUE",
        popular: true,
        skinImage: "/assets/ranks/skin_elite_v2.png",
        focus: "Top-tier trader benefits, lowest market fees, and strong sustainable income.",
        joiningBonus: "$35,000",
        weeklySalary: "$8,500/wk",
        multiplier: "1.35x (+35%)",
        perks: [
          "One-Time Joining Bonus: $35,000",
          "Weekly Salary: $8,500 / week",
          "Shop & Sell Multiplier: 1.35x (+35%) more money on /shop",
          "Auction House (/ah): 20 active listings",
          "Auction House: 1.5% listing tax (maximum retention)",
          "Access to highlight / feature listings on /ah",
          "Jobs & Mob Killing: +20% bonus money per action",
          "Auto-Sell: Access to 1 Auto-Sell Chest or a 1.25x Sell Wand"
        ]
      },
      {
        id: "creator",
        name: "STREAMER / CREATOR",
        price: "PARTNER",
        accent: "rank-creator",
        badge: "CREATOR",
        skinImage: "/assets/ranks/skin_creator_v2.png",
        focus: "Matched to MVP/Elite level to avoid gameplay grind on stream, plus audience interaction mechanics.",
        joiningBonus: "MVP/Elite Tier",
        weeklySalary: "$5,000/wk",
        multiplier: "1.25x (+25%)",
        perks: [
          "Matched Base Economy: 1.25x Sell Multiplier, 10 listings",
          "Weekly Creator Stipend: $5,000 / week for stream events & mini-games",
          "Community Giveaway: /moneydrop & /coinflip with reduced server cut",
          "Community Bounties: Host bounties without server tax penalties",
          "Creator Code Support: Viewers use /support <Name> at webstore for rewards"
        ],
        ctaText: "Apply on Discord",
        ctaHref: "https://dsc.gg/napa"
      }
    ] as RankProduct[]
  },
  coc: {
    clanName: "napa_cmut_",
    clanTag: "#2J9GGJJPQ",
    clanLevel: "Level 1",
    warFrequency: "Always",
    cwlLeague: "Unranked (Recruiting)",
    capitalHall: "Capital Peak Unlocked",
    members: "3 / 50 Active",
    requiredTownHall: "All Town Halls Welcome",
    requiredTrophies: "0+ Trophies (Open)",
    description:
      "Official Clash of Clans clan for the NAPA Community. Led by Antony_4444 (Town Hall 15). Friendly, talkative, and actively recruiting members for Clan Wars, CWL, and Clan Games!",
    openLink: "https://link.clashofclans.com/en?action=OpenClanProfile&tag=2J9GGJJPQ",
    discordChannelUrl: "https://dsc.gg/napa",
    perks: [
      {
        title: "High TH Troop Donations",
        description: "High Town Hall donators (TH 15 Leader) providing siege machines, super troops, and defensive war CC.",
        badge: "TH 15 BACKING"
      },
      {
        title: "Clan War League & Clan Wars",
        description: "Active war roster setup. Everyone who opts in gets a chance to participate in regular wars and upcoming CWL.",
        badge: "WAR FOCUS"
      },
      {
        title: "Friendly & Talkative Community",
        description: "Active chat in-game and on our dedicated Discord channel at dsc.gg/napa.",
        badge: "COMMUNITY"
      },
      {
        title: "Clan Capital & Raid Weekends",
        description: "Contribute raid medals and unlock district upgrades together as our clan levels up.",
        badge: "RAID SQUADS"
      },
      {
        title: "Clan Games Rewards",
        description: "Join forces every month to unlock bonus magic items, builder potions, and runes.",
        badge: "CLAN GAMES"
      },
      {
        title: "Fast Promotions for Active Players",
        description: "Earn Elder and Co-Leader through donations, friendly attitude, and war reliability.",
        badge: "PROMOTIONS"
      }
    ],
    requirements: [
      {
        title: "All Town Halls Welcome",
        description: "Whether you're starting fresh or a seasoned veteran, join the NAPA community clan.",
        icon: "castle"
      },
      {
        title: "Active Participation",
        description: "Attack in wars if your shield is Green, and help in Clan Games & Weekend Raids.",
        icon: "swords"
      },
      {
        title: "Friendly & Respectful",
        description: "Keep chat friendly, supportive, and active. Request troops freely.",
        icon: "chat"
      },
      {
        title: "Join NAPA Discord",
        description: "Join dsc.gg/napa for war ping alerts, announcements, and Minecraft & CoC community chat.",
        icon: "discord"
      }
    ],
    roles: [
      {
        role: "Leader",
        requirement: "Antony_4444 (Town Hall 15) • Clan Founder & High-Level Siege Donator.",
        color: "text-amber-400"
      },
      {
        role: "Co-Leader / Admin",
        requirement: "Venom & trusted clan coordinators helping manage war rosters and invitations.",
        color: "text-rose-400"
      },
      {
        role: "Member",
        requirement: "Open to all active players. Donate, clash, and grow with NAPA.",
        color: "text-purple-300"
      }
    ]
  } as CocConfig,
  footer: {
    copyright: "Copyright 2026 NAPA. All Rights Reserved. We do not have affiliation with any real world brands.",
    legal:
      "This website and its checkout process is owned & operated by Tebex Limited, who handle product fulfillment, billing support and refunds.",
    links: [
      { label: "Minecraft SMP", href: "/home" },
      { label: "Clash of Clans", href: "/coc" },
      { label: "Ranks Store", href: "/ranks" },
      { label: "Admin Panel", href: "/admin" },
      { label: "Discord Community", href: "https://dsc.gg/napa" }
    ]
  }
}
