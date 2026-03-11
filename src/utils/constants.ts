export const RANKS = [
  { name: 'Bronze',       img: 'bronze.png',   exp: 0    },
  { name: 'Silver',       img: 'silver.png',   exp: 30   },
  { name: 'Gold',         img: 'gold.png',     exp: 80   },
  { name: 'Platinum II',  img: 'platinum.png', exp: 200  },
  { name: 'Platinum I',   img: 'platinum.png', exp: 310  },
  { name: 'Diamond III',  img: 'diamond.png',  exp: 430  },
  { name: 'Diamond II',   img: 'diamond.png',  exp: 560  },
  { name: 'Diamond I',    img: 'diamond.png',  exp: 700  },
  { name: 'Crimson III',  img: 'crimson.png',  exp: 860  },
  { name: 'Crimson II',   img: 'crimson.png',  exp: 1040 },
  { name: 'Crimson I',    img: 'crimson.png',  exp: 1230 },
  { name: 'Astral III',   img: 'astral.png',   exp: 1430 },
  { name: 'Astral II',    img: 'astral.png',   exp: 1620 },
  { name: 'Astral I',     img: 'astral.png',   exp: 1760 },
  { name: 'Sys Architect',img: 'sysadmin.png', exp: 1900 },
];

export function getRank(exp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (exp >= r.exp) rank = r; }
  return rank;
}

export function getNextRank(exp: number) {
  for (const r of RANKS) { if (exp < r.exp) return r; }
  return null;
}

export const RANK_GLOWS: Record<string, string> = {
  Bronze:        'drop-shadow(0 0 3px rgba(180,100,30,0.3))',
  Silver:        'drop-shadow(0 0 5px rgba(200,200,210,0.55))',
  Gold:          'drop-shadow(0 0 8px rgba(220,140,40,0.7))',
  Platinum:      'drop-shadow(0 0 6px rgba(100,220,200,0.6))',
  Diamond:       'drop-shadow(0 0 8px rgba(80,160,255,0.7))',
  Crimson:       'drop-shadow(0 0 10px rgba(220,40,40,0.85))',
  Astral:        'drop-shadow(0 0 10px rgba(160,80,255,0.85))',
  'Sys Architect':'drop-shadow(0 0 12px rgba(255,80,30,0.95))',
};
