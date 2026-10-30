export function CustomPvpEmoji({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Diamond blade gradient */}
        <linearGradient id="pvpDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        {/* Purple enchantment sheen */}
        <linearGradient id="pvpEnchant" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
        </linearGradient>
        {/* Gold hilt gradient */}
        <linearGradient id="pvpGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        {/* Ruby gem in pommel */}
        <radialGradient id="pvpRuby" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        {/* Drop shadow */}
        <filter id="pvpGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Sparks */}
      <circle cx="32" cy="12" r="1.5" fill="#fef08a" />
      <path d="M32 8L33 11L36 12L33 13L32 16L31 13L28 12L31 11Z" fill="#fde047" opacity="0.9" />
      <circle cx="16" cy="22" r="1" fill="#c084fc" />
      <circle cx="48" cy="22" r="1" fill="#38bdf8" />

      {/* Sword 1: Left-to-Right (Pointing Up-Right) */}
      <g transform="rotate(45 32 32)" filter="url(#pvpGlow)">
        {/* Blade */}
        <path d="M30 6L32 2L34 6L34 38L30 38Z" fill="url(#pvpDiamond)" />
        {/* Center fuller ridge */}
        <path d="M32 4L32 38" stroke="#e0f2fe" strokeWidth="1" strokeLinecap="round" />
        {/* Enchantment shine */}
        <path d="M30 10L34 6L34 26L30 30Z" fill="url(#pvpEnchant)" />
        {/* Crossguard */}
        <rect x="23" y="38" width="18" height="4.5" rx="2" fill="url(#pvpGold)" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="32" cy="40.2" r="1.5" fill="url(#pvpRuby)" />
        {/* Grip */}
        <rect x="29.5" y="42.5" width="5" height="9" rx="1" fill="#451a03" />
        <line x1="30" y1="45" x2="34" y2="45" stroke="#d97706" strokeWidth="0.8" />
        <line x1="30" y1="48" x2="34" y2="48" stroke="#d97706" strokeWidth="0.8" />
        {/* Pommel */}
        <circle cx="32" cy="54" r="3" fill="url(#pvpGold)" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="32" cy="54" r="1.2" fill="url(#pvpRuby)" />
      </g>

      {/* Sword 2: Right-to-Left (Pointing Up-Left) */}
      <g transform="rotate(-45 32 32)" filter="url(#pvpGlow)">
        {/* Blade */}
        <path d="M30 6L32 2L34 6L34 38L30 38Z" fill="url(#pvpDiamond)" />
        {/* Center fuller ridge */}
        <path d="M32 4L32 38" stroke="#e0f2fe" strokeWidth="1" strokeLinecap="round" />
        {/* Enchantment shine */}
        <path d="M30 10L34 6L34 26L30 30Z" fill="url(#pvpEnchant)" />
        {/* Crossguard */}
        <rect x="23" y="38" width="18" height="4.5" rx="2" fill="url(#pvpGold)" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="32" cy="40.2" r="1.5" fill="url(#pvpRuby)" />
        {/* Grip */}
        <rect x="29.5" y="42.5" width="5" height="9" rx="1" fill="#451a03" />
        <line x1="30" y1="45" x2="34" y2="45" stroke="#d97706" strokeWidth="0.8" />
        <line x1="30" y1="48" x2="34" y2="48" stroke="#d97706" strokeWidth="0.8" />
        {/* Pommel */}
        <circle cx="32" cy="54" r="3" fill="url(#pvpGold)" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="32" cy="54" r="1.2" fill="url(#pvpRuby)" />
      </g>
    </svg>
  )
}

export function CustomEconomyEmoji({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Bag texture gradient */}
        <radialGradient id="ecoBag" cx="40%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        {/* Shiny coin gradient */}
        <linearGradient id="ecoCoin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        {/* Emerald Gem */}
        <linearGradient id="ecoEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="45%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        {/* Glow */}
        <filter id="ecoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#f59e0b" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Sparkling stars */}
      <path d="M50 14L51 17L54 18L51 19L50 22L49 19L46 18L49 17Z" fill="#fde047" />
      <circle cx="14" cy="20" r="1.5" fill="#34d399" />

      {/* Gold Coin Stack Left Behind */}
      <ellipse cx="20" cy="50" rx="9" ry="4.5" fill="#ca8a04" />
      <ellipse cx="20" cy="48" rx="8" ry="4" fill="url(#ecoCoin)" stroke="#a16207" strokeWidth="0.8" />
      <ellipse cx="18" cy="45" rx="8" ry="4" fill="url(#ecoCoin)" stroke="#a16207" strokeWidth="0.8" />

      {/* Main Treasure Bag */}
      <g filter="url(#ecoGlow)">
        {/* Bag Base */}
        <path
          d="M32 20C26 20 22 22 18 27C14 32 15 48 20 54C25 60 39 60 44 54C49 48 50 32 46 27C42 22 38 20 32 20Z"
          fill="url(#ecoBag)"
          stroke="#78350f"
          strokeWidth="1.2"
        />

        {/* Bag Folds/Creases */}
        <path d="M24 34C28 42 36 42 40 34" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M22 44C27 50 37 50 42 44" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* Rope Tie Neck */}
        <rect x="27" y="19" width="10" height="4" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
        <path d="M31 23L30 27" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M33 23L34 26" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />

        {/* Top Bag Flap Ruffles */}
        <path
          d="M26 19C25 15 26 12 28 11C30 10 32 12 32 12C32 12 34 10 36 11C38 12 39 15 38 19Z"
          fill="#f59e0b"
          stroke="#92400e"
          strokeWidth="1"
        />

        {/* Central Inset Minecraft Emerald Badge */}
        <polygon
          points="32,32 37,36 37,44 32,48 27,44 27,36"
          fill="url(#ecoEmerald)"
          stroke="#064e3b"
          strokeWidth="0.8"
        />
        {/* Emerald facets */}
        <polygon points="32,32 37,36 32,40 27,36" fill="#a7f3d0" opacity="0.7" />
        <polygon points="27,36 32,40 32,48 27,44" fill="#047857" opacity="0.5" />
        <polygon points="37,36 37,44 32,48 32,40" fill="#059669" opacity="0.6" />
      </g>

      {/* Gold Coin Right Foreground */}
      <g transform="translate(42, 46)">
        <ellipse cx="6" cy="6" rx="7" ry="5" fill="#ca8a04" />
        <ellipse cx="6" cy="4.5" rx="6.5" ry="4.5" fill="url(#ecoCoin)" stroke="#a16207" strokeWidth="0.8" />
        <text x="6" y="6.5" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#78350f" fontFamily="sans-serif">
          $
        </text>
      </g>
    </svg>
  )
}

export function CustomCrownEmoji({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Crown Gold Gradient */}
        <linearGradient id="crGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="30%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        {/* Velvet Cap Interior */}
        <radialGradient id="crVelvet" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#581c87" />
        </radialGradient>
        {/* Rubies */}
        <radialGradient id="crRuby" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="60%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
        {/* Sapphires */}
        <radialGradient id="crSapphire" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        {/* Emeralds */}
        <radialGradient id="crEmerald" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
        {/* Crown Glow */}
        <filter id="crGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#eab308" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Royal Starlight Flares */}
      <path d="M32 4L33.5 10L39 11.5L33.5 13L32 19L30.5 13L25 11.5L30.5 10Z" fill="#fef08a" />
      <circle cx="12" cy="18" r="1.5" fill="#fde047" />
      <circle cx="52" cy="18" r="1.5" fill="#fde047" />

      <g filter="url(#crGlow)">
        {/* Velvet Arch Background */}
        <path d="M16 46C16 36 22 28 32 26C42 28 48 36 48 46Z" fill="url(#crVelvet)" opacity="0.85" />

        {/* Crown 5-Peak Silhouette */}
        <path
          d="M10 48L12 26L22 36L32 18L42 36L52 26L54 48Z"
          fill="url(#crGold)"
          stroke="#78350f"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Inner Peak Shading Lines */}
        <path d="M32 19L32 48" stroke="#ca8a04" strokeWidth="1" opacity="0.6" />
        <path d="M22 36L25 48" stroke="#ca8a04" strokeWidth="0.8" opacity="0.5" />
        <path d="M42 36L39 48" stroke="#ca8a04" strokeWidth="0.8" opacity="0.5" />

        {/* Peak Pearls / Jewel Spheres */}
        <circle cx="12" cy="25" r="3" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />
        <circle cx="22" cy="35" r="2.5" fill="url(#crRuby)" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="32" cy="17" r="3.8" fill="url(#crRuby)" stroke="#78350f" strokeWidth="0.8" />
        <circle cx="42" cy="35" r="2.5" fill="url(#crRuby)" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="52" cy="25" r="3" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />

        {/* Crown Base Rim Band */}
        <path d="M9 48H55V55H9Z" fill="url(#crGold)" stroke="#78350f" strokeWidth="1.2" />
        {/* Lower Rim Soft Fur / Trim */}
        <rect x="8" y="54" width="48" height="4" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />

        {/* Inlaid Gems along the band */}
        <circle cx="16" cy="51.5" r="2.2" fill="url(#crSapphire)" />
        <polygon points="24,49.5 26.5,51.5 24,53.5 21.5,51.5" fill="url(#crEmerald)" />
        <circle cx="32" cy="51.5" r="2.8" fill="url(#crRuby)" />
        <polygon points="40,49.5 42.5,51.5 40,53.5 37.5,51.5" fill="url(#crEmerald)" />
        <circle cx="48" cy="51.5" r="2.2" fill="url(#crSapphire)" />
      </g>
    </svg>
  )
}


export function CustomMinecraftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mcDiamondHead" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="mcHandleWood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Pickaxe Shaft */}
      <path
        d="M6 18L14 10"
        stroke="url(#mcHandleWood)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M5 19L7 17"
        stroke="#451a03"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Diamond Pickaxe Head Arc */}
      <path
        d="M10 5C13 4 18 5 20 8C19 10 18 11 16 11L14 9L15 7C14 6 12 6.5 11 7L10 5Z"
        fill="url(#mcDiamondHead)"
        stroke="#0891b2"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      <path
        d="M19 7C19 7 15 4 9 7L7 9C9 15 12 19 12 19L14 17C14 17 11 13 9 10L14 5"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="0.5"
        opacity="0.8"
      />
      {/* Sparkle */}
      <circle cx="18" cy="5" r="1" fill="#cffafe" />
    </svg>
  )
}

export function CustomCocIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cocGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="cocShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
      {/* Clash Crossed Swords */}
      <path
        d="M4 4L20 20M5 3L3 5M20 18L18 20"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 4L4 20M19 3L21 5M4 18L6 20"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Clan Shield Body */}
      <path
        d="M12 3C8 3 6 5 6 10C6 16 12 21 12 21C12 21 18 16 18 10C18 5 16 3 12 3Z"
        fill="url(#cocShieldBg)"
        stroke="url(#cocGold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Shield Cross Accent */}
      <path
        d="M12 6V17M8 10H16"
        stroke="#fef08a"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Golden Central Boss */}
      <circle cx="12" cy="10" r="1.8" fill="url(#cocGold)" stroke="#78350f" strokeWidth="0.5" />
    </svg>
  )
}

export function CustomCocShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cocShieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <linearGradient id="cocShieldPurp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 5V11C4 16.5 7.4 21.6 12 22.9C16.6 21.6 20 16.5 20 11V5L12 2Z"
        fill="url(#cocShieldPurp)"
        stroke="url(#cocShieldGold)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M12 5V19C15.5 17.8 18 14 18 10.5V6.5L12 5Z"
        fill="#ffffff"
        opacity="0.12"
      />
      <path
        d="M8.5 10L11 12.5L15.5 8"
        stroke="#fef08a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CustomTrophyEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="trophyStem" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      {/* Cup Body */}
      <path
        d="M7 4H17V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V4Z"
        fill="url(#trophyGold)"
        stroke="#78350f"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Rim */}
      <path d="M6 3.5H18V5H6V3.5Z" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
      {/* Handles */}
      <path
        d="M7 6C4.5 6 4 9 5 11C5.7 12.3 7 12.5 7 12.5"
        stroke="url(#trophyGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 6C19.5 6 20 9 19 11C18.3 12.3 17 12.5 17 12.5"
        stroke="url(#trophyGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Stem */}
      <path d="M10.5 16H13.5V19H10.5V16Z" fill="url(#trophyStem)" stroke="#78350f" strokeWidth="0.8" />
      {/* Base */}
      <path d="M7 19H17V21.5H7V19Z" fill="url(#trophyGold)" stroke="#78350f" strokeWidth="1" />
      {/* Star Emblem */}
      <polygon points="12,7.5 12.8,9.5 15,9.5 13.2,10.8 13.8,12.8 12,11.5 10.2,12.8 10.8,10.8 9,9.5 11.2,9.5" fill="#ffffff" opacity="0.9" />
    </svg>
  )
}

export function CustomShieldEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shieldGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <linearGradient id="shieldCore" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 5V11C4 16.5 7.4 21.4 12 22.8C16.6 21.4 20 16.5 20 11V5L12 2Z"
        fill="url(#shieldCore)"
        stroke="url(#shieldGoldRim)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M12 5V20C15 18.5 17.5 14.5 17.5 11V6.5L12 5Z"
        fill="#ffffff"
        opacity="0.12"
      />
      <circle cx="12" cy="11.5" r="3.2" fill="url(#shieldGoldRim)" stroke="#78350f" strokeWidth="0.8" />
      <circle cx="12" cy="11.5" r="1.5" fill="#fef08a" />
    </svg>
  )
}

export function CustomSwordsEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="swordBlade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Blade 1 */}
      <path d="M5 19L18 6" stroke="url(#swordBlade)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M17 5L19 7" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 15L9 17" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="4" cy="20" r="1.5" fill="#eab308" />

      {/* Blade 2 */}
      <path d="M19 19L6 6" stroke="url(#swordBlade)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M7 5L5 7" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 15L15 17" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.5" fill="#eab308" />

      {/* Center Clash Spark */}
      <circle cx="12" cy="12" r="1.2" fill="#fef08a" />
    </svg>
  )
}

export function CustomMembersEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="memberFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="memberBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Back User */}
      <circle cx="16" cy="7.5" r="3" fill="url(#memberBack)" opacity="0.75" />
      <path
        d="M11.5 18C11.5 15 13.5 13 16.5 13C19.5 13 21.5 15 21.5 18"
        stroke="url(#memberBack)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Front User */}
      <circle cx="9" cy="8.5" r="3.5" fill="url(#memberFront)" stroke="#064e3b" strokeWidth="0.75" />
      <path
        d="M3.5 20C3.5 16 6 14 9 14C12 14 14.5 16 14.5 20"
        stroke="url(#memberFront)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CustomLightningEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="boltGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.5" />
        </filter>
      </defs>
      <path
        d="M13 2L4 13H11L10 22L20 10H13L13 2Z"
        fill="url(#boltGrad)"
        stroke="#78350f"
        strokeWidth="0.8"
        strokeLinejoin="round"
        filter="url(#boltGlow)"
      />
      <path d="M12 4L6 12H11L10.5 17L17 11H12.5L12 4Z" fill="#ffffff" opacity="0.35" />
    </svg>
  )
}

export function CustomScrollEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <path
        d="M6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8H17C18.1046 8 19 8.89543 19 10V18C19 19.1046 18.1046 20 17 20H6C4.89543 20 4 19.1046 4 18V6"
        fill="url(#parchment)"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="8" y1="11" x2="15" y2="11" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="14" x2="15" y2="14" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="17" x2="13" y2="17" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
      {/* Red Wax Seal */}
      <circle cx="16.5" cy="17.5" r="2.2" fill="#ef4444" stroke="#991b1b" strokeWidth="0.6" />
    </svg>
  )
}

export function CustomChatEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path
        d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C10.5 20 9.2 19.6 8 18.9L4 20L5.1 16C4.4 14.8 4 13.5 4 12Z"
        fill="url(#chatGrad)"
        stroke="#c084fc"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="12" r="1.2" fill="#ffffff" />
      <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
      <circle cx="15.5" cy="12" r="1.2" fill="#ffffff" />
    </svg>
  )
}

export function CustomServerEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="7" rx="2" fill="#1e293b" stroke="url(#serverGrad)" strokeWidth="1.5" />
      <rect x="3" y="14" width="18" height="7" rx="2" fill="#1e293b" stroke="url(#serverGrad)" strokeWidth="1.5" />
      <circle cx="6.5" cy="6.5" r="1.2" fill="#22c55e" />
      <circle cx="10" cy="6.5" r="1.2" fill="#38bdf8" />
      <circle cx="6.5" cy="17.5" r="1.2" fill="#22c55e" />
      <circle cx="10" cy="17.5" r="1.2" fill="#38bdf8" />
      <line x1="14" y1="6.5" x2="18" y2="6.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="17.5" x2="18" y2="17.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function CustomCpuEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="#0f172a" stroke="url(#cpuGrad)" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="url(#cpuGrad)" />
      {/* Pins top */}
      <line x1="9" y1="2" x2="9" y2="5" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="2" x2="12" y2="5" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="2" x2="15" y2="5" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      {/* Pins bottom */}
      <line x1="9" y1="19" x2="9" y2="22" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="19" x2="15" y2="22" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
      {/* Pins left */}
      <line x1="2" y1="9" x2="5" y2="9" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="2" y1="12" x2="5" y2="12" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="2" y1="15" x2="5" y2="15" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      {/* Pins right */}
      <line x1="19" y1="9" x2="22" y2="9" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="19" y1="12" x2="22" y2="12" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="19" y1="15" x2="22" y2="15" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function CustomRamEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="2" y="8" width="20" height="9" rx="1.5" fill="#064e3b" stroke="url(#ramGrad)" strokeWidth="1.4" />
      <rect x="4.5" y="10" width="3" height="4" rx="0.5" fill="#34d399" />
      <rect x="9" y="10" width="3" height="4" rx="0.5" fill="#34d399" />
      <rect x="13.5" y="10" width="3" height="4" rx="0.5" fill="#34d399" />
      <line x1="3" y1="18.5" x2="6" y2="18.5" stroke="#fbbf24" strokeWidth="1.2" />
      <line x1="8" y1="18.5" x2="11" y2="18.5" stroke="#fbbf24" strokeWidth="1.2" />
      <line x1="13" y1="18.5" x2="16" y2="18.5" stroke="#fbbf24" strokeWidth="1.2" />
      <line x1="18" y1="18.5" x2="21" y2="18.5" stroke="#fbbf24" strokeWidth="1.2" />
    </svg>
  )
}

export function CustomPlayerHeadEmoji({ className = "w-5 h-5 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#headGrad)" stroke="#78350f" strokeWidth="1" />
      {/* Hair */}
      <rect x="4" y="4" width="16" height="5" fill="#451a03" />
      <rect x="4" y="9" width="3" height="4" fill="#451a03" />
      <rect x="17" y="9" width="3" height="4" fill="#451a03" />
      {/* Eyes */}
      <rect x="7" y="11" width="2" height="2" fill="#ffffff" />
      <rect x="9" y="11" width="1" height="2" fill="#2563eb" />
      <rect x="15" y="11" width="2" height="2" fill="#ffffff" />
      <rect x="14" y="11" width="1" height="2" fill="#2563eb" />
      {/* Mouth / Beard */}
      <rect x="10" y="15" width="4" height="2" fill="#78350f" />
    </svg>
  )
}
