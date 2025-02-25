import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@mui/material';

const PlayerCard = ({ player, showStats, disabled, selected, onClick, hasGame }) => {
  // Get any active coach effects for this player
  const coachEffects = activeCoachEffects[player.id] || {};
  
  // Calculate displayed stats including temporary boosts
  const displayStats = {
    points: player.points + (coachEffects.points || 0),
    rebounds: player.rebounds + (coachEffects.rebounds || 0),
    assists: player.assists + (coachEffects.assists || 0),
    stocks: player.stocks + (coachEffects.stocks || 0)
  };

  // Get all positions including temporary ones
  const allPositions = [
    ...player.position.split(',').map(p => p.trim()),
    ...(coachEffects.additionalPositions || [])
  ];

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`card ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
        onClick={() => !disabled && onClick(player)}
      >
        <CardContent>
          <h2 className="title">{player.name}</h2>
          <div className="player-info">
            <span className="team">{player.team}</span>
            <span className="position">{allPositions.join(', ')}</span>
          </div>
          {showStats && (
            <div className="stats-container">
              <p>Points: {displayStats.points}</p>
              <p>Rebounds: {displayStats.rebounds}</p>
              <p>Assists: {displayStats.assists}</p>
              <p>Stocks: {displayStats.stocks}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlayerCard; 