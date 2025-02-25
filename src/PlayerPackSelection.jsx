import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './BasketballCardGameApp';
import { INITIAL_PLAYERS, OTHER_PLAYERS } from './data/playerData';

export default function PlayerPackSelection({ onBack, setCurrentPlayers, currentPlayers }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Randomly select 3 players from all players, allowing duplicates with current pool
  const selectedPlayers = React.useMemo(() => {
    // Combine both player pools
    const allPlayers = [...INITIAL_PLAYERS, ...OTHER_PLAYERS];
    
    // Create a copy of the selected player with a new unique ID
    const createPlayerCopy = (player, index) => {
      // Get the highest ID from both current players and all players
      const maxId = Math.max(
        ...currentPlayers.map(p => p.id),
        ...allPlayers.map(p => p.id)
      );
      // Add index to ensure uniqueness within this pack
      return {
        ...player,
        id: maxId + index + 1
      };
    };
    
    // Shuffle and select 3, creating copies with unique IDs
    const shuffled = [...allPlayers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((player, index) => createPlayerCopy(player, index));
    
    console.log('Player Pack Options:', shuffled.map(p => `${p.name} (ID: ${p.id})`));
    return shuffled;
  }, [currentPlayers]);

  const handleSelect = (player) => {
    setSelectedPlayer(player);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    console.log('Confirmed selection:', selectedPlayer.name, 'with ID:', selectedPlayer.id);
    
    // Add the selected player to currentPlayers
    setCurrentPlayers(prev => {
      const updatedPlayers = [...prev, selectedPlayer];
      console.log('Updated Current Players:', updatedPlayers.map(p => `${p.name} (ID: ${p.id})`));
      return updatedPlayers;
    });

    setShowConfirmation(false);
    onBack();
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
    setShowConfirmation(false);
  };

  return (
    <div className="player-pack-container">
      <div className="nav-buttons">
        <Button
          onClick={onBack}
          className="button-blue"
        >
          Back to Shop
        </Button>
      </div>
      
      <h2 className="pack-title">Select One Player</h2>
      
      <div className="pack-cards">
        {selectedPlayers.map(player => (
          <motion.div
            key={player.id}
            className="player-pack-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="player-pack-content">
              <h3>{player.name}</h3>
              <div className="player-info">
                <span className="team">{player.team}</span>
                <span className="position">{player.position}</span>
              </div>
              <Button 
                className="button-green"
                onClick={() => handleSelect(player)}
              >
                Select
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Selection</h3>
            <p>Are you sure you want to select {selectedPlayer.name}?</p>
            <div className="confirmation-buttons">
              <Button 
                className="button-green"
                onClick={handleConfirm}
              >
                Yes
              </Button>
              <Button 
                className="button-red"
                onClick={handleCancel}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 