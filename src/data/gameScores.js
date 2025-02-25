export const SERIES_SCORES = {
  1: [100, 300, 800],
  2: [2000, 5000, 11000],
  3: [20000, 35000, 50000],
  4: [50000, 50000, 50000]  // Fallback values if somehow we get past series 3
};

// Helper function to get the score for a specific series and game
export const getScoreForGame = (seriesNumber, gameNumber) => {
  const series = SERIES_SCORES[seriesNumber] || SERIES_SCORES[4];  // Fallback to series 4 if invalid
  return series[gameNumber - 1];  // gameNumber is 1-based, array is 0-based
}; 