// React app for a basketball card game styled like Balatro with Jokic Cards
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import './BasketballCardGame.css';
import Shop from './Shop';
import { fetchGamesForDate } from './data/nbaSchedule';
import { getScoreForGame } from './data/gameScores';
import { 
  NBA_PLAYERS,
  generatePlayerStats,
  generateInitialPlayers,
  playerHasGame
} from './data/nbaPlayerStats';
import { JOKIC_CARDS, getRandomJokicCard } from './data/jokicCards';
import WelcomeScreen from './WelcomeScreen';

// Replace the Sportradar API constants with balldontlie API
const API_BASE_URL = 'https://www.balldontlie.io/api/v1';
const SEASON_YEAR = 2023;

// Add these constants at the top
const SEASON_START_DATE = new Date('2023-10-24');

// Add this near the other constants at the top
const SERIES_SCORES = {
  1: 100,
  2: 300,
  3: 800,
  4: 2000,
  5: 5000,
  6: 11000,
  7: 20000,
  8: 35000,
  9: 50000
};

// Update the generateRandomStats function to use the player's base stats
const generateRandomStats = (player) => {
  return generatePlayerStats(player);
};

// Add this function to fetch player stats
const fetchPlayerStats = async (player) => {
  console.log(`Attempting to fetch stats for ${player.name}...`);
  
  try {
    // First get the player's ID from the API
    const searchUrl = `${API_BASE_URL}/players?search=${encodeURIComponent(player.name)}`;
    console.log('Searching player URL:', searchUrl);
    
    const playerResponse = await fetch(searchUrl);
    const playerData = await playerResponse.json();
    console.log('Player search response:', playerData);
    
    if (!playerData.data.length) {
      console.warn(`⚠️ No player found for ${player.name}`);
      return null;
    }
    
    const playerId = playerData.data[0].id;
    console.log(`Found player ID for ${player.name}:`, playerId);
    
    // Then get their stats from last season
    const statsUrl = `${API_BASE_URL}/season_averages?season=${SEASON_YEAR}&player_ids[]=${playerId}`;
    console.log('Fetching stats URL:', statsUrl);
    
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();
    console.log(`Stats for ${player.name}:`, statsData);
    
    if (!statsData.data.length) {
      console.warn(`⚠️ No stats found for ${player.name}`);
      return null;
    }
    
    return statsData.data[0];
  } catch (error) {
    console.error('❌ Error fetching player stats:', error);
    console.error('Player:', player);
    console.error('Stack:', error.stack);
    return null;
  }
};

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Card = ({ children, className = "", onClick }) => (
  <div className={`card ${className}`} onClick={onClick}>
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="card-content">
    {children}
  </div>
);

// Export the Button component
export const Button = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`button ${className}`}
  >
    {children}
  </button>
);

// Update the PlayerCard component
const PlayerCard = ({ player, showStats, disabled, selected, onClick, hasGame, activeCoachEffects }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Get any active coach effects for this player
  const coachEffects = activeCoachEffects?.[player.id] || {};

  // Generate base stats for the player
  const baseStats = useMemo(() => {
    if (hasGame) {
      return generatePlayerStats(player);
    }
    return {
      points: 0,
      rebounds: 0,
      assists: 0,
      stocks: 0
    };
  }, [player, hasGame]);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
  <motion.div
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    transition={{ duration: 0.2 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
  >
    <Card 
          className={`card ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''} 
            ${hasGame ? 'has-game' : ''} ${selected && hasGame ? 'selected-game' : ''}`}
      onClick={() => !disabled && onClick(player)}
    >
      <CardContent>
            <h2 className="title">{player.name}</h2>
            <div className="player-info">
              <span className="team">{player.team}</span>
              <span className="position">{player.position}</span>
          </div>
      </CardContent>
    </Card>
  </motion.div>

      {showTooltip && (
        <div 
          className="stats-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <p>Points: <span>{baseStats.points}{coachEffects.points ? ` (+${coachEffects.points})` : ''}</span></p>
          <p>Rebounds: <span>{baseStats.rebounds}{coachEffects.rebounds ? ` (+${coachEffects.rebounds})` : ''}</span></p>
          <p>Assists: <span>{baseStats.assists}{coachEffects.assists ? ` (+${coachEffects.assists})` : ''}</span></p>
          <p>Stocks: <span>{baseStats.stocks}{coachEffects.stocks ? ` (+${coachEffects.stocks})` : ''}</span></p>
          {coachEffects.additionalPositions?.length > 0 && (
            <p className="coach-positions">Added Positions: {coachEffects.additionalPositions.join(', ')}</p>
          )}
          {!hasGame && (
            <p className="no-game-note">No game scheduled today</p>
          )}
        </div>
      )}
    </>
  );
};

// Update the JokicCard component to support drag
const JokicCard = ({ cardId, index, onReorder }) => (
  <Reorder.Item
    value={cardId}
    id={cardId}
    className="jokic-card active"
    whileHover={{ scale: 1.05 }}
    whileDrag={{ scale: 1.1 }}
  >
    <div className="jokic-card-content">
      <h3>{JOKIC_CARDS[cardId].name}</h3>
      <p className="jokic-card-effect">{JOKIC_CARDS[cardId].effect}</p>
      <div className="active-indicator">Active</div>
    </div>
  </Reorder.Item>
);

// Update the ScoreWidget component
const ScoreWidget = ({ 
  players, 
  calculateFinalStats, 
  lineupSet, 
  positionAssignments, 
  currentGames,
  money
}) => {
  const emptyStats = {
    points: 0,
    rebounds: 0,
    assists: 0,
    stocks: 0,
    multiplier: 1
  };

  const baseStats = useMemo(() => {
    if (!lineupSet) return emptyStats;
    
    // If no players are assigned, return empty stats
    const hasAnyPlayers = Object.values(positionAssignments).some(player => player !== null);
    if (!hasAnyPlayers) {
      console.log('No players in lineup - showing zero stats');
      return emptyStats;
    }
    
    // Calculate stats with position bonus
    return Object.entries(positionAssignments).reduce((stats, [position, player]) => {
      if (!player) return stats;
      
      // Check if player has a game today
      const hasGame = playerHasGame(player, currentGames);
      
      // If no game, use 0 for all stats
      const playerStats = hasGame ? {
        points: player.points,
        rebounds: player.rebounds,
        assists: player.assists,
        stocks: player.stocks
      } : {
        points: 0,
        rebounds: 0,
        assists: 0,
        stocks: 0
      };

      // Check if player is in correct position
      const isValidPosition = player.position.split(',').map(p => p.trim()).includes(position);
      const multiplier = isValidPosition ? 1.25 : 1;

      console.log(`${player.name}: ${hasGame ? 'has game' : 'NO GAME'} - ${hasGame ? 'using actual stats' : 'using 0 stats'} with ${multiplier}x multiplier`);
      
      return {
        points: stats.points + (playerStats.points * multiplier),
        rebounds: stats.rebounds + (playerStats.rebounds * multiplier),
        assists: stats.assists + (playerStats.assists * multiplier),
        stocks: stats.stocks + (playerStats.stocks * multiplier),
      };
    }, {
      points: 0,
      rebounds: 0,
      assists: 0,
      stocks: 0
    });
  }, [players, lineupSet, positionAssignments, currentGames]);

  const finalStats = lineupSet ? calculateFinalStats(baseStats) : emptyStats;

  return (
    <div className={`score-widget ${!lineupSet ? 'inactive' : ''}`}>
      <h2 className="score-title">Team Stats</h2>
      <div className="stat-container">
        <div className="stat-item">
          <span className="stat-label">Points</span>
          <span className="stat-value">{finalStats.points}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rebounds</span>
          <span className="stat-value">{finalStats.rebounds}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Assists</span>
          <span className="stat-value">{finalStats.assists}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Stocks</span>
          <span className="stat-value">{finalStats.stocks}</span>
        </div>
      </div>
      <div className="total-section">
        <div className="total-item">
          <span className="total-label">Total Stats</span>
          <span className="total-value">
            {finalStats.points + finalStats.rebounds + finalStats.assists + finalStats.stocks}
          </span>
        </div>
        <div className="multiplier-item">
          <span className="mult-label">Multiplier</span>
          <span className="mult-value">×{finalStats.multiplier.toFixed(1)}</span>
        </div>
        <div className="final-score">
          <span className="final-label">Final Score</span>
          <span className="final-value">
            {Math.floor((finalStats.points + finalStats.rebounds + finalStats.assists + finalStats.stocks) * finalStats.multiplier)}
          </span>
        </div>
      </div>
      <div className="money-section">
        <div className="money-display">
          <span className="money-label">Money</span>
          <span className="money-value">${money}</span>
        </div>
      </div>
    </div>
  );
};

// Add this near the top of the file, after imports
window.gameState = {};

// Move PositionSlot component definition inside main component
export default function BasketballCardGame() {
  const [dealtPlayers, setDealtPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [lineupSet, setLineupSet] = useState(false);
  const [discardedPlayers, setDiscardedPlayers] = useState([]);
  const [ownedCards, setOwnedCards] = useState([]);
  const [availableJokicCards, setAvailableJokicCards] = useState([]);
  const [showShop, setShowShop] = useState(false);
  // Add position assignments state here
  const [positionAssignments, setPositionAssignments] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null
  });
  const [currentDate, setCurrentDate] = useState(SEASON_START_DATE);
  const [currentGames, setCurrentGames] = useState([]);
  const [seriesNumber, setSeriesNumber] = useState(1);
  const [gameNumber, setGameNumber] = useState(1);
  const [scoreToBeat, setScoreToBeat] = useState(() => {
    const initialScore = getScoreForGame(1, 1);
    console.log('Initializing score to beat:', initialScore);
    return initialScore;
  });
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [finalScore, setFinalScore] = useState(0);
  const [money, setMoney] = useState(0);
  // Add new state for substitutions
  const [substitutionsLeft, setSubstitutionsLeft] = useState(3);
  // Add skipsLeft state here
  const [skipsLeft, setSkipsLeft] = useState(5);
  // Add new state for current players pool
  const [currentPlayers, setCurrentPlayers] = useState(() => {
    const initial = NBA_PLAYERS;
    console.log('Initial Current Players:', initial.map(p => p.name));
    return initial;
  });
  // Add new state for temporary coach effects
  const [activeCoachEffects, setActiveCoachEffects] = useState({});
  // Add new state for welcome screen
  const [showWelcome, setShowWelcome] = useState(true);

  // Add this effect to update the global state whenever relevant states change
  useEffect(() => {
    window.gameState = {
      currentPlayers,
      activeCoachEffects,
      findPlayer: (name) => {
        const player = currentPlayers.find(p => p.name.includes(name));
        if (!player) return 'Player not found';
        return {
          player,
          coachEffects: activeCoachEffects[player.id] || 'No coach effects'
        };
      }
    };
  }, [currentPlayers, activeCoachEffects]);

  // Update the resetGame function
  const resetGame = useCallback(() => {
    // Generate new current players pool
    const newCurrentPlayers = NBA_PLAYERS;
    console.log('Resetting game with new Current Players:', newCurrentPlayers.map(p => p.name));
    setCurrentPlayers(newCurrentPlayers);
    
    // Reset other state
    setDealtPlayers([]);
    setSelectedPlayers([]);
    setLineupSet(false);
    setDiscardedPlayers([]);
    setOwnedCards([]);
    setAvailableJokicCards([]);
    setShowShop(false);
    setGameStatus('playing');
    setFinalScore(0);
    setSeriesNumber(1);
    setGameNumber(1);
    setScoreToBeat(scoreToBeat);
    setCurrentDate(SEASON_START_DATE);
    setPositionAssignments({
      PG: null, SG: null, SF: null, PF: null, C: null
    });
    setMoney(0);
    setSubstitutionsLeft(3);
    setSkipsLeft(5);
  }, [scoreToBeat]);

  // Update the dealPlayers function to use currentPlayers instead of INITIAL_PLAYERS
  const dealPlayers = useCallback(() => {
    const shuffled = [...NBA_PLAYERS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    console.log('Current Players pool:', currentPlayers.map(p => p.name));
    console.log('Dealing 8 players:', shuffled.map(p => p.name));
    setDealtPlayers(shuffled);
    setSelectedPlayers([]);
    setLineupSet(false);
    setDiscardedPlayers([]);
  }, [currentPlayers]);

  const togglePlayer = useCallback((player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else if (prev.length < 5) {
        return [...prev, player];
      }
      return prev;
    });
  }, []);

  // Update the discardSelectedPlayers function to use currentPlayers
  const discardSelectedPlayers = useCallback(() => {
    if (substitutionsLeft <= 0) return;

    const remainingPlayers = dealtPlayers.filter(
      player => !selectedPlayers.some(p => p.id === player.id)
    );
    
    // Get all players that aren't currently dealt or discarded
    const availablePlayers = currentPlayers.filter(player => 
      !dealtPlayers.some(p => p.id === player.id) &&
      !discardedPlayers.some(p => p.id === player.id)
    );

    console.log('Current Players pool:', currentPlayers.map(p => p.name));
    console.log('Available for substitution:', availablePlayers.map(p => p.name));

    const shuffledAvailable = [...availablePlayers]
      .sort(() => 0.5 - Math.random());
    const numNewPlayersNeeded = selectedPlayers.length;
    const newPlayers = shuffledAvailable.slice(0, numNewPlayersNeeded);

    console.log('Discarding:', selectedPlayers.map(p => p.name));
    console.log('Adding:', newPlayers.map(p => p.name));
    
    setDealtPlayers([...remainingPlayers, ...newPlayers]);
    setDiscardedPlayers([...discardedPlayers, ...selectedPlayers]);
    setSelectedPlayers([]);
    setSubstitutionsLeft(prev => prev - 1);
  }, [currentPlayers, dealtPlayers, selectedPlayers, discardedPlayers, substitutionsLeft]);

  const generateShopCards = useCallback(() => {
    const availableForShop = Object.keys(JOKIC_CARDS)
      .filter(id => !ownedCards.includes(parseInt(id)));
    const shuffled = availableForShop.sort(() => 0.5 - Math.random());
    const newCards = shuffled.slice(0, 2);
    setAvailableJokicCards(newCards);
    return newCards;  // Return the new cards
  }, [ownedCards]);

  const handleShowShop = useCallback(() => {
    if (availableJokicCards.length === 0) {
      generateShopCards();
    }
    setShowShop(true);
  }, [generateShopCards, availableJokicCards.length]);

  const handleReroll = useCallback((isFree = false) => {
    if (!isFree) {
      setMoney(prev => prev - 2); // Only deduct money if not a free reroll
    }
    
    // Just call generateShopCards, don't try to use its return value
    generateShopCards();
    console.log('Shop rerolled:', isFree ? '(free)' : '($2 spent)');
  }, [generateShopCards]); // Add generateShopCards to dependencies

  const calculateFinalStats = useCallback((baseStats) => {
    console.log('Calculating final stats with base stats:', baseStats);
    console.log('Owned Jokic cards:', ownedCards);
    
    // Check position states
    const hasPG = Object.entries(positionAssignments).some(([pos, player]) => 
      pos === 'PG' && player && player.position.includes('PG')
    );
    const hasSG = Object.entries(positionAssignments).some(([pos, player]) => 
      pos === 'SG' && player && player.position.includes('SG')
    );
    const hasSF = Object.entries(positionAssignments).some(([pos, player]) => 
      pos === 'SF' && player && player.position.includes('SF')
    );
    const hasPF = Object.entries(positionAssignments).some(([pos, player]) => 
      pos === 'PF' && player && player.position.includes('PF')
    );
    const hasC = Object.entries(positionAssignments).some(([pos, player]) => 
      pos === 'C' && player && player.position.includes('C')
    );

    // Check if all positions are correct or wrong
    const allPositionsCorrect = Object.entries(positionAssignments).every(([pos, player]) => 
      player && player.position.includes(pos)
    );
    
    const allPositionsWrong = Object.entries(positionAssignments).every(([pos, player]) => 
      player && !player.position.includes(pos)
    );

    // Start with base stats
    let stats = { 
      ...baseStats, 
      multiplier: 1,
      hasPG,
      hasSG,
      hasSF,
      hasPF,
      hasC,
      allPositionsCorrect,
      allPositionsWrong
    };

    // Apply coach effects before Jokic cards
    console.log('Active coach effects:', activeCoachEffects);
    Object.entries(activeCoachEffects).forEach(([playerId, effect]) => {
      console.log(`Applying coach effects to player ${playerId}:`, effect);
      stats.points += (effect.points || 0);
      stats.rebounds += (effect.rebounds || 0);
      stats.assists += (effect.assists || 0);
      stats.stocks += (effect.stocks || 0);
    });
    
    // Apply Jokic card effects
    ownedCards.forEach(cardId => {
      const card = JOKIC_CARDS[cardId];
      console.log(`Applying card ${cardId}:`, card.name);
      stats = card.applyEffect(stats);
      console.log('Stats after effect:', stats);
    });

    // Remove position flags before returning
    const { hasPG: _, hasSG: __, hasSF: ___, hasPF: ____, hasC: _____, 
            allPositionsCorrect: ______, allPositionsWrong: _______, ...finalStats } = stats;

    console.log('Final stats after all effects:', finalStats);
    return finalStats;
  }, [ownedCards, positionAssignments, activeCoachEffects]);

  const purchaseCard = useCallback((card) => {
    const cardId = parseInt(card.id);
    if (!ownedCards.includes(cardId)) {
      if (ownedCards.length >= 5) {
        alert("Maximum of 5 Jokic cards allowed. Sell a card first.");
      return;
      }
      setOwnedCards(prev => [...prev, cardId]);
      setAvailableJokicCards(prev => prev.filter(id => parseInt(id) !== cardId));
    }
  }, [ownedCards]);

  // Move handlePositionSelect inside
  const handlePositionSelect = useCallback((position, playerId) => {
    const player = dealtPlayers.find(p => p.id === parseInt(playerId));
    if (player) {
      setPositionAssignments(prev => ({
        ...prev,
        [position]: player
      }));
      
      setDealtPlayers(prev => prev.filter(p => p.id !== player.id));
      
      if (!selectedPlayers.some(p => p.id === player.id)) {
    setSelectedPlayers(prev => [...prev, player]);
      }
    }
  }, [dealtPlayers, selectedPlayers]);

  // Add handleBenchPlayer function
  const handleBenchPlayer = useCallback((position) => {
    const player = positionAssignments[position];
    if (player) {
      // Add player back to dealtPlayers
      setDealtPlayers(prev => [...prev, player]);
      
      // Remove from position assignments
      setPositionAssignments(prev => ({
        ...prev,
        [position]: null
      }));
      
      // Remove from selected players if present
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
    }
  }, [positionAssignments]);

  // Update the PositionSlot component
  const PositionSlot = ({ position, availablePlayers, onSelect }) => {
    const assignedPlayer = positionAssignments[position];
    const isValidPosition = assignedPlayer && 
      assignedPlayer.position.split(',').map(p => p.trim()).includes(position);

    return (
      <div className={`position-slot ${assignedPlayer ? 'filled' : 'empty'} ${
        assignedPlayer ? (isValidPosition ? 'valid-position' : 'invalid-position') : ''
      }`}>
        <div className="position-label">{position}</div>
        <select 
          className="position-select"
          value={assignedPlayer ? assignedPlayer.id : ''}
          onChange={(e) => onSelect(position, e.target.value)}
          disabled={assignedPlayer !== null}
        >
          <option value="">Select Player</option>
          {[...availablePlayers, assignedPlayer].filter(Boolean).map(player => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.position})
            </option>
          ))}
        </select>
        {assignedPlayer && (
          <div className="position-player">
            <h3>{assignedPlayer.name}</h3>
            <div className="player-info">
              <span className="team">{assignedPlayer.team}</span>
              <span className="position">{assignedPlayer.position}</span>
            </div>
            {!isValidPosition && (
              <div className="position-warning">Out of Position</div>
            )}
            {lineupSet && (
              <div className="stats-container">
                <p>Points: {assignedPlayer.points}</p>
                <p>Rebounds: {assignedPlayer.rebounds}</p>
                <p>Assists: {assignedPlayer.assists}</p>
                <p>Stocks: {assignedPlayer.stocks}</p>
              </div>
            )}
            <Button
              onClick={() => handleBenchPlayer(position)}
              className="button-red bench-button"
            >
              Bench
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Update the useEffect to handle the new API response format
  useEffect(() => {
    const loadPlayerStats = async () => {
      console.log('Starting to load player stats...');
      try {
        // Deal exactly 8 random players initially
        const shuffled = [...NBA_PLAYERS]
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setDealtPlayers(shuffled);
      } catch (error) {
        console.error('❌ Error in loadPlayerStats:', error);
      }
    };

    loadPlayerStats();
  }, []);

  // Add useEffect to fetch games when date changes
  useEffect(() => {
    const loadGames = async () => {
      const games = await fetchGamesForDate(currentDate);
      console.log('Games for', currentDate.toDateString(), ':', games);
      setCurrentGames(games);
    };
    
    loadGames();
  }, [currentDate]);

  // Update the handleSetLineup function
  const handleSetLineup = useCallback(() => {
    setLineupSet(true);
    
    setPositionAssignments(prev => {
      const updatedAssignments = { ...prev };
      Object.entries(updatedAssignments).forEach(([position, player]) => {
        if (player && playerHasGame(player, currentGames)) {
          const randomStats = generateRandomStats(player);
          updatedAssignments[position] = {
            ...player,
            ...randomStats
          };
        }
      });

      // Calculate base stats first (same as in ScoreWidget)
      const baseStats = Object.entries(updatedAssignments).reduce((stats, [position, player]) => {
        if (!player) return stats;
        
        const hasGame = playerHasGame(player, currentGames);
        const playerStats = hasGame ? {
          points: player.points,
          rebounds: player.rebounds,
          assists: player.assists,
          stocks: player.stocks
        } : {
          points: 0,
          rebounds: 0,
          assists: 0,
          stocks: 0
        };

        const isValidPosition = player.position.split(',').map(p => p.trim()).includes(position);
        const multiplier = isValidPosition ? 1.25 : 1;

        return {
          points: stats.points + (playerStats.points * multiplier),
          rebounds: stats.rebounds + (playerStats.rebounds * multiplier),
          assists: stats.assists + (playerStats.assists * multiplier),
          stocks: stats.stocks + (playerStats.stocks * multiplier),
          multiplier: 1
        };
      }, {
        points: 0,
        rebounds: 0,
        assists: 0,
        stocks: 0,
        multiplier: 1
      });

      // Calculate final stats using the same method as ScoreWidget
      const finalStats = calculateFinalStats(baseStats);
      const score = Math.floor(
        (finalStats.points + finalStats.rebounds + finalStats.assists + finalStats.stocks) * finalStats.multiplier
      );
      
      console.log('Final calculated score:', score);
      console.log('Score to beat:', scoreToBeat);
      
      // Update score and game status
      setFinalScore(score);
      const isWon = score >= scoreToBeat;
      setGameStatus(isWon ? 'won' : 'lost');

      if (isWon) {
        // Calculate money earned
        const baseReward = 3;
        const substitutionBonus = substitutionsLeft;
        const totalEarned = baseReward + substitutionBonus;

        // Add money for win and unused substitutions
        setMoney(prev => prev + totalEarned);

        // Reroll shop for free
        console.log('Game won - rerolling shop for free');
        handleReroll(true);
      }

      return updatedAssignments;
    });
  }, [currentGames, calculateFinalStats, scoreToBeat, handleReroll, substitutionsLeft]);

  // Update the handleNextGame function
  const handleNextGame = useCallback(() => {
    console.log('=== Starting Next Round Sequence ===');
    
    // Calculate next values
    let nextGameNumber, nextSeriesNumber, nextScoreToBeat;

    if (gameNumber === 3) {
      // Moving to next series
      nextGameNumber = 1;
      nextSeriesNumber = seriesNumber + 1;
      nextScoreToBeat = getScoreForGame(nextSeriesNumber, 1);
      console.log(`End of series: Moving to series ${nextSeriesNumber}, game 1, setting score to ${nextScoreToBeat}`);
      // Reset skips only when moving to new series
      setSkipsLeft(5);
      console.log('Reset skips to 5 for new series');
    } else {
      // Moving to next game in same series
      nextGameNumber = gameNumber + 1;
      nextSeriesNumber = seriesNumber;
      nextScoreToBeat = getScoreForGame(seriesNumber, nextGameNumber);
      console.log(`Moving to game ${nextGameNumber}, setting score target to ${nextScoreToBeat}`);
    }

    // Clear lineup and players
    setPositionAssignments({
      PG: null, SG: null, SF: null, PF: null, C: null
    });
    setSelectedPlayers([]);
    setDealtPlayers([]);
    setDiscardedPlayers([]);
    
    // Update game state
    setGameNumber(nextGameNumber);
    setSeriesNumber(nextSeriesNumber);
    console.log(`Setting new score to beat: ${nextScoreToBeat}`);
    setScoreToBeat(nextScoreToBeat);
    
    // Advance the date by one day
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    console.log('Advancing date to:', nextDate.toDateString());
    setCurrentDate(nextDate);
    
    setLineupSet(false);
    setGameStatus('playing');
    setFinalScore(0);
    
    // Add reward and deal new players
    setMoney(prev => prev + 3);
    const shuffled = [...NBA_PLAYERS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    setDealtPlayers(shuffled);

    // Reset only substitutions every round
    setSubstitutionsLeft(3);

    // Reset coach effects for new game
    setActiveCoachEffects({});

    console.log('=== Next Round Sequence Complete ===');

    // Show the shop after advancing the round
    setShowShop(true);
  }, [currentDate, gameNumber, seriesNumber]);

  // Update the SeriesWidget component
  const SeriesWidget = () => {
    return (
      <div className="series-widget">
        <h2 className="series-title">Series {seriesNumber}</h2>
        <div className="series-info">
          <div className="game-progress">
            Game {gameNumber} of 3
          </div>
          <div className="score-goal">
            <div className="goal-label">Score to Beat</div>
            <div className="goal-value">{scoreToBeat}</div>
          </div>
        </div>
      </div>
    );
  };

  // Update the advanceDate function
  const advanceDate = useCallback(async () => {
    if (skipsLeft <= 0) return;
    
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
    setSkipsLeft(prev => prev - 1);
  }, [currentDate, skipsLeft]);

  // Update the DateWidget component definition
  const DateWidget = ({ currentDate, onAdvance, onReset, games, skipsLeft }) => {
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <div className="date-widget">
        <h3 className="date-title">Game Date</h3>
        <div className="date-value">{formatDate(currentDate)}</div>
        <div className="skip-value">Skip: {skipsLeft}</div>
        {games && games.length > 0 && (
          <div className="games-list">
            {games.map((game, index) => (
              <div key={index} className="game-item">
                {game.awayTeam} @ {game.homeTeam}
              </div>
            ))}
          </div>
        )}
        <div className="date-controls">
          <button 
            className="date-button"
            onClick={onAdvance}
            disabled={skipsLeft <= 0}
            title={skipsLeft <= 0 ? "No skips remaining" : "Skip to Next Day"}
          >
            <span>Skip</span>
          </button>
          <button 
            className="date-button"
            onClick={onReset}
            title="Reset to Season Start"
          >
            <span>Reset</span>
          </button>
        </div>
      </div>
    );
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  if (showShop) {
  return (
      <div className="container">
        <div className="nav-buttons">
          <Button
            onClick={() => setShowShop(false)}
            className="button-blue"
          >
            Back to Game
          </Button>
        </div>
        <Shop
          jokicCards={JOKIC_CARDS}
          ownedCards={ownedCards}
          availableCards={availableJokicCards}
          onPurchase={(card) => {
            purchaseCard(card);
            setMoney(prev => prev - 2);
          }}
          onReroll={() => handleReroll(false)}
          onSell={(cardId) => setOwnedCards(prev => prev.filter(id => id !== cardId))}
          setCurrentPlayers={setCurrentPlayers}
          currentPlayers={currentPlayers}
          money={money}
          setMoney={setMoney}
          setActiveCoachEffects={setActiveCoachEffects}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="nav-buttons">
        <Button 
          onClick={handleShowShop}
          className="button-blue"
        >
          Shop
        </Button>
      </div>
      <div className="game-layout">
        <div className="series-and-cards">
          <SeriesWidget />
          <div className="jokic-cards">
            {ownedCards.length > 0 ? (
              <Reorder.Group
                axis="x"
                values={ownedCards}
                onReorder={setOwnedCards}
                className="jokic-cards-container"
              >
                {ownedCards.map((cardId, index) => (
                  <JokicCard 
                    key={cardId}
                    cardId={cardId}
                    index={index}
                  />
                ))}
              </Reorder.Group>
            ) : (
              <div className="no-jokic-cards">
                Purchase cards in shop
              </div>
            )}
          </div>
      </div>

        <div className="button-container">
          {!lineupSet ? (
            <>
       
              <Button 
                onClick={handleSetLineup}
                className="button-green"
              >
                Set Lineup ({selectedPlayers.length}/5)
              </Button>
              <Button
                onClick={handleShowShop}
                className="button-yellow"
              >
                Shop
        </Button>
        <Button 
                onClick={resetGame}
                className="button-red"
              >
                Reset Game
              </Button>
            </>
          ) : (
            <Button 
              onClick={gameStatus === 'lost' ? resetGame : handleNextGame}
              className={gameStatus === 'lost' ? "button-red" : "button-blue"}
            >
              {gameStatus === 'lost' ? "Restart Game" : "Next Round"}
        </Button>
          )}
        </div>

        <div className="lineup-row">
          <ScoreWidget 
            players={selectedPlayers} 
            calculateFinalStats={calculateFinalStats}
            lineupSet={lineupSet}
            positionAssignments={positionAssignments}
            currentGames={currentGames}
            money={money}
          />
          
          <div className="lineup-container">
            <h2 className="section-title">Set Lineup</h2>
            <div className="position-slots">
              {['PG', 'SG', 'SF', 'PF', 'C'].map((position) => (
                <div key={position} className="position-slot">
                  <PositionSlot 
                    position={position}
                    availablePlayers={dealtPlayers}
                    onSelect={handlePositionSelect}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-row">
          <div className="stats-section">
            <DateWidget 
              currentDate={currentDate} 
              onAdvance={advanceDate}
              onReset={() => setCurrentDate(SEASON_START_DATE)}
              games={currentGames}
              skipsLeft={skipsLeft}
            />
      </div>

          <div className="available-players">
            <h2 className="section-title">Bench</h2>
            <div className="card-grid">
        {dealtPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showStats={true}
            disabled={false}
            selected={selectedPlayers.some(p => p.id === player.id)}
            onClick={togglePlayer}
            hasGame={playerHasGame(player, currentGames)}
            activeCoachEffects={activeCoachEffects}
          />
        ))}
      </div>
            <div className="discard-button-container">
              <Button 
                onClick={discardSelectedPlayers}
                disabled={selectedPlayers.length === 0 || substitutionsLeft <= 0}
                className="button-red"
              >
                Substitutions Left: {substitutionsLeft} ({selectedPlayers.length})
              </Button>
            </div>
          </div>
      </div>

        {lineupSet && (
          <div className={`game-status ${gameStatus}`}>
            <div className="game-status-content">
              <h2>{gameStatus === 'won' ? 'Victory!' : 'Defeat'}</h2>
              <div className="final-score">Final Score: {finalScore}</div>
              <div className="target-score">Target: {scoreToBeat}</div>
              {gameStatus === 'won' && (
                <>
                  <div className="earnings-breakdown">
                    <div className="money-earned">Win Bonus: +$3</div>
                    <div className="money-earned">Unused Substitutions: +${substitutionsLeft}</div>
                    <div className="total-earned">Total Earned: +${3 + substitutionsLeft}</div>
                  </div>
                  <Button 
                    onClick={handleNextGame}
                    className="button-green"
                  >
                    Next Round
                  </Button>
                </>
              )}
              {gameStatus === 'lost' && (
                <Button 
                  onClick={() => window.location.reload()}
                  className="button-red"
                >
                  Restart Game
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
