import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './BasketballCardGameApp';
import { COACH_CARDS } from './data/coachCards';

export default function CoachPackSelection({ onBack, currentPlayers, setCurrentPlayers, setActiveCoachEffects }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Randomly select 8 players from currentPlayers
  const selectedPlayers = React.useMemo(() => {
    const shuffled = [...currentPlayers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    console.log('Selected Players for Coach Pack:', shuffled.map(p => p.name));
    return shuffled;
  }, [currentPlayers]);

  // Randomly select 3 coach cards
  const selectedCoaches = React.useMemo(() => {
    const shuffled = [...COACH_CARDS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    console.log('Coach Pack Options:', shuffled.map(c => c.name));
    return shuffled;
  }, []);

  const handleSelect = (card) => {
    if (!selectedPlayer) {
      // If no player is selected, show an alert
      alert("Please select a player first!");
      return;
    }
    setSelectedCard(card);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (!selectedCard || !selectedPlayer) return;

    console.log('Before applying coach effect - Player:', selectedPlayer.name);
    console.log('Applying effect:', selectedCard);

    if (selectedCard.type === 'position') {
      setActiveCoachEffects(prev => {
        const newEffects = {
          ...prev,
          [selectedPlayer.id]: {
            ...(prev[selectedPlayer.id] || {}),
            additionalPositions: [
              ...(prev[selectedPlayer.id]?.additionalPositions || []),
              selectedCard.bonus
            ]
          }
        };
        console.log('Updated coach effects:', newEffects);
        return newEffects;
      });

      // Temporarily update player's positions for display
      setCurrentPlayers(prev => prev.map(player => {
        if (player.id === selectedPlayer.id) {
          const positions = new Set([
            ...player.position.split(',').map(p => p.trim()),
            selectedCard.bonus
          ]);
          return {
            ...player,
            position: Array.from(positions).join(', ')
          };
        }
        return player;
      }));
    } else {
      // Make stat effects stack
      setActiveCoachEffects(prev => {
        const newEffects = {
          ...prev,
          [selectedPlayer.id]: {
            ...(prev[selectedPlayer.id] || {}),
            [selectedCard.type]: (prev[selectedPlayer.id]?.[selectedCard.type] || 0) + selectedCard.bonus
          }
        };
        console.log('Updated coach effects:', newEffects);
        return newEffects;
      });
    }

    setShowConfirmation(false);
    onBack();
  };

  const handleCancel = () => {
    setSelectedCard(null);
    setShowConfirmation(false);
  };

  // Add handler for player selection
  const handlePlayerSelect = (player) => {
    setSelectedPlayer(selectedPlayer?.id === player.id ? null : player);
    console.log('Selected player:', player.name);
  };

  return (
    <div className="coach-pack-container">
      <div className="nav-buttons">
        <Button
          onClick={onBack}
          className="button-blue"
        >
          Back to Shop
        </Button>
      </div>
      
      <div className="coach-pack-layout">
        {/* Players Section */}
        <div className="players-section">
          <h2 className="section-title">Available Players</h2>
          <div className="players-grid">
            {selectedPlayers.map(player => (
              <motion.div
                key={player.id}
                className={`player-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handlePlayerSelect(player)}
              >
                <div className="player-content">
                  <h3>{player.name}</h3>
                  <div className="player-info">
                    <span className="team">{player.team}</span>
                    <span className="position">{player.position}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coaches Section */}
        <div className="coaches-section">
          <h2 className="section-title">Select a Coach</h2>
          <div className="coaches-grid">
            {selectedCoaches.map(card => (
              <motion.div
                key={card.id}
                className={`coach-card ${card.rarity}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="coach-content">
                  <h3>{card.name}</h3>
                  <div className="coach-card-info">
                    <span className="effect">{card.effect}</span>
                    <span className="rarity">{card.rarity}</span>
                  </div>
                  <Button 
                    className="button-green"
                    onClick={() => handleSelect(card)}
                  >
                    Select
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Selection</h3>
            <p>Apply {selectedCard.name} to {selectedPlayer.name}?</p>
            <div className="confirmation-details">
              <div className="player-detail">
                <span className="detail-label">Player:</span>
                <span className="detail-value">{selectedPlayer.name}</span>
                <span className="detail-sub">({selectedPlayer.team} - {selectedPlayer.position})</span>
              </div>
              <div className="coach-detail">
                <span className="detail-label">Coach Effect:</span>
                <span className="detail-value">{selectedCard.effect}</span>
                <span className="detail-sub">({selectedCard.rarity})</span>
              </div>
            </div>
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