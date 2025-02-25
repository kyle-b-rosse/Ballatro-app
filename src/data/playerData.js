export const INITIAL_PLAYERS = [
  { id: 1, name: "Nikola Jokic", team: "DEN", position: "C" },
  { id: 2, name: "Victor Wembanyama", team: "SA", position: "C" },
  { id: 3, name: "Shai Gilgeous-Alexander", team: "OKC", position: "PG,SG" },
  { id: 4, name: "Anthony Davis", team: "LAL", position: "PF,C" },
  { id: 5, name: "Karl-Anthony Towns", team: "MIN", position: "PF,C" },
  { id: 6, name: "Damian Lillard", team: "MIL", position: "PG" },
  { id: 7, name: "Kevin Durant", team: "PHO", position: "SF,PF" },
  { id: 8, name: "Tyrese Maxey", team: "PHI", position: "PG,SG" },
  { id: 9, name: "Domantas Sabonis", team: "SAC", position: "C" },
  { id: 10, name: "LeBron James", team: "LAL", position: "SF,PF" },
  { id: 11, name: "James Harden", team: "LAC", position: "PG,SG" },
  { id: 12, name: "Cade Cunningham", team: "DET", position: "PG,SG" },
  { id: 13, name: "Jayson Tatum", team: "BOS", position: "SF,PF" },
  { id: 14, name: "Luka Doncic", team: "DAL", position: "PG,SG" },
  { id: 15, name: "Kyrie Irving", team: "DAL", position: "PG,SG" },
  { id: 16, name: "Stephen Curry", team: "GS", position: "PG" },
  { id: 17, name: "Anthony Edwards", team: "MIN", position: "SG,SF" },
  { id: 18, name: "Devin Booker", team: "PHO", position: "PG,SG" },
  { id: 19, name: "Joel Embiid", team: "PHI", position: "C" },
  { id: 20, name: "Trey Murphy III", team: "NO", position: "SF,PF" }
].map(player => ({
  ...player,
  points: 0,
  rebounds: 0,
  steals: 0,
  blocks: 0,
  assists: 0
}));

export const OTHER_PLAYERS = [
  { id: 21, name: "Giannis Antetokounmpo", team: "MIL", position: "PF,C" },
  { id: 22, name: "Donovan Mitchell", team: "CLE", position: "SG" },
  { id: 23, name: "Ja Morant", team: "MEM", position: "PG" },
  { id: 24, name: "Trae Young", team: "ATL", position: "PG" },
  { id: 25, name: "Paolo Banchero", team: "ORL", position: "PF" },
  { id: 26, name: "Scottie Barnes", team: "TOR", position: "SF,PF" },
  { id: 27, name: "Jalen Brunson", team: "NYK", position: "PG" },
  { id: 28, name: "De'Aaron Fox", team: "SAC", position: "PG" },
  { id: 29, name: "Desmond Bane", team: "MEM", position: "SG" },
  { id: 30, name: "Mikal Bridges", team: "BKN", position: "SF" },
  { id: 31, name: "Zion Williamson", team: "NO", position: "PF" },
  { id: 32, name: "Brandon Ingram", team: "NO", position: "SF" },
  { id: 33, name: "Jamal Murray", team: "DEN", position: "PG" },
  { id: 34, name: "Kawhi Leonard", team: "LAC", position: "SF" },
  { id: 35, name: "Paul George", team: "LAC", position: "SF,SG" },
  { id: 36, name: "Jimmy Butler", team: "MIA", position: "SF" },
  { id: 37, name: "Bam Adebayo", team: "MIA", position: "C" },
  { id: 38, name: "Jalen Green", team: "HOU", position: "SG" },
  { id: 39, name: "Alperen Sengun", team: "HOU", position: "C" },
  { id: 40, name: "Lauri Markkanen", team: "UTA", position: "PF" },
  { id: 41, name: "Kristaps Porzingis", team: "BOS", position: "PF,C" },
  { id: 42, name: "Derrick White", team: "BOS", position: "PG,SG" },
  { id: 43, name: "Jrue Holiday", team: "BOS", position: "PG,SG" },
  { id: 44, name: "Devin Vassell", team: "SA", position: "SG,SF" },
  { id: 45, name: "Franz Wagner", team: "ORL", position: "SF" },
  { id: 46, name: "Tyrese Haliburton", team: "IND", position: "PG" },
  { id: 47, name: "Pascal Siakam", team: "IND", position: "PF" },
  { id: 48, name: "Julius Randle", team: "NYK", position: "PF" },
  { id: 49, name: "Bradley Beal", team: "PHO", position: "SG" },
  { id: 50, name: "Klay Thompson", team: "GS", position: "SG" }
].map(player => ({
  ...player,
  points: 0,
  rebounds: 0,
  steals: 0,
  blocks: 0,
  assists: 0
}));

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to generate Current Players pool
export const generateCurrentPlayers = () => {
  // Shuffle both arrays
  const shuffledInitial = shuffleArray(INITIAL_PLAYERS);
  const shuffledOther = shuffleArray(OTHER_PLAYERS);

  // Take 10 from each
  const selectedInitial = shuffledInitial.slice(0, 10);
  const selectedOther = shuffledOther.slice(0, 10);

  // Combine and shuffle again for randomness
  const combinedPlayers = shuffleArray([...selectedInitial, ...selectedOther]);

  console.log('Generated new Current Players pool:', combinedPlayers.map(p => p.name));
  return combinedPlayers;
};

// Helper function to generate random stats
export const generateRandomStats = () => ({
  points: Math.floor(Math.random() * 25) + 5,    // 5-30 points
  rebounds: Math.floor(Math.random() * 12) + 2,  // 2-14 rebounds
  assists: Math.floor(Math.random() * 8) + 2,    // 2-10 assists
  steals: Math.floor(Math.random() * 3) + 0,     // 0-3 steals
  blocks: Math.floor(Math.random() * 3) + 0      // 0-3 blocks
});

// Helper function to check if player has a game
export const playerHasGame = (player, games) => {
  if (!games || !games.length) return false;
  return games.some(game => 
    game.homeTeam === player.team || game.awayTeam === player.team
  );
}; 