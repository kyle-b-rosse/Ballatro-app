// Each card has:
// - id: unique identifier
// - name: display name
// - effect: description shown to player
// - applyEffect: function that takes stats object and returns modified stats
// Stats object has: { points, rebounds, assists, stocks, multiplier }

export const JOKIC_CARDS = {
  1: {
    name: "Scoring Touch",
    effect: "Multiply points by 1.5",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points * 1.5
    })
  },
  2: {
    name: "Board Master",
    effect: "Multiply rebounds by 1.5",
    applyEffect: (stats) => ({
      ...stats,
      rebounds: stats.rebounds * 1.5
    })
  },
  3: {
    name: "Defensive Master",
    effect: "Multiply stocks by 4",
    applyEffect: (stats) => ({
      ...stats,
      stocks: stats.stocks * 4
    })
  },
  4: {
    name: "Playmaker",
    effect: "Multiply assists by 1.5",
    applyEffect: (stats) => ({
      ...stats,
      assists: stats.assists * 1.5
    })
  },
  5: {
    name: "MVP Performance",
    effect: "Multiply all stats by 2",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points * 2,
      rebounds: stats.rebounds * 2,
      assists: stats.assists * 2,
      stocks: stats.stocks * 2
    })
  },
  6: {
    name: "Triple Double",
    effect: "Add 20% to final score",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * 1.2
    })
  },
  7: {
    name: "PG Multiplier",
    effect: "PG in lineup: 2x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.hasPG ? 2 : 1)
    })
  },
  8: {
    name: "SG Multiplier",
    effect: "SG in lineup: 2x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.hasSG ? 2 : 1)
    })
  },
  9: {
    name: "SF Multiplier",
    effect: "SF in lineup: 2x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.hasSF ? 2 : 1)
    })
  },
  10: {
    name: "PF Multiplier",
    effect: "PF in lineup: 2x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.hasPF ? 2 : 1)
    })
  },
  11: {
    name: "C Multiplier",
    effect: "C in lineup: 2x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.hasC ? 2 : 1)
    })
  },
  12: {
    name: "PG Scorer",
    effect: "PG in lineup: +50 points",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points + (stats.hasPG ? 50 : 0)
    })
  },
  13: {
    name: "SG Scorer",
    effect: "SG in lineup: +50 points",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points + (stats.hasSG ? 50 : 0)
    })
  },
  14: {
    name: "SF Scorer",
    effect: "SF in lineup: +50 points",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points + (stats.hasSF ? 50 : 0)
    })
  },
  15: {
    name: "PF Scorer",
    effect: "PF in lineup: +50 points",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points + (stats.hasPF ? 50 : 0)
    })
  },
  16: {
    name: "C Scorer",
    effect: "C in lineup: +50 points",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points + (stats.hasC ? 50 : 0)
    })
  },
  17: {
    name: "Perfect Positions",
    effect: "All positions correct: 15x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.allPositionsCorrect ? 15 : 1)
    })
  },
  18: {
    name: "Point Boost",
    effect: "+50 points",
    applyEffect: (stats) => ({
      ...stats,
      points: stats.points + 50
    })
  },
  19: {
    name: "Rebound Boost",
    effect: "+50 rebounds",
    applyEffect: (stats) => ({
      ...stats,
      rebounds: stats.rebounds + 50
    })
  },
  20: {
    name: "Assist Boost",
    effect: "+50 assists",
    applyEffect: (stats) => ({
      ...stats,
      assists: stats.assists + 50
    })
  },
  21: {
    name: "Stocks Boost",
    effect: "+50 stocks",
    applyEffect: (stats) => ({
      ...stats,
      stocks: stats.stocks + 50
    })
  },
  22: {
    name: "Chaos Lineup",
    effect: "All positions wrong: 15x multiplier",
    applyEffect: (stats) => ({
      ...stats,
      multiplier: stats.multiplier * (stats.allPositionsWrong ? 15 : 1)
    })
  }
};

// Helper function to get a random Jokic card
export const getRandomJokicCard = () => {
  const cardIds = Object.keys(JOKIC_CARDS);
  const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];
  return { id: randomId, ...JOKIC_CARDS[randomId] };
}; 