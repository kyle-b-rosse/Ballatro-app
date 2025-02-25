import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './BasketballCardGameApp.jsx';
import PlayerPackSelection from './PlayerPackSelection';
import CoachPackSelection from './CoachPackSelection';

const ShopJokicCard = ({ card, onPurchase, onSell, isOwned, money }) => (
  <motion.div
    className="shop-card"
    whileHover={{ scale: 1.05 }}
  >
    <div className="shop-card-content">
      <h2 className="title">{card.name}</h2>
      <div className="shop-card-effect">
        {card.effect}
      </div>
      {isOwned ? (
        <Button 
          onClick={() => onSell(parseInt(card.id))}
          className="button-red mt-4"
        >
          Sell Card
        </Button>
      ) : (
        <Button 
          onClick={() => onPurchase(card)}
          className="button-green mt-4"
          disabled={money < 2}
        >
          Purchase ($2)
        </Button>
      )}
    </div>
  </motion.div>
);

export default function Shop({ 
  jokicCards, 
  ownedCards, 
  availableCards, 
  onPurchase, 
  onReroll, 
  onSell,
  setCurrentPlayers,
  currentPlayers,
  money,
  setMoney,
  setActiveCoachEffects
}) {
  const [isRerolling, setIsRerolling] = useState(false);
  const [showPlayerPack, setShowPlayerPack] = useState(false);
  const [showCoachPack, setShowCoachPack] = useState(false);

  const handleReroll = () => {
    setIsRerolling(true);
    setTimeout(() => {
      onReroll();
      setIsRerolling(false);
    }, 300);
  };

  const handlePurchase = (card) => {
    if (money >= 2) {
      onPurchase(card);
    } else {
      alert("Not enough money! Jokic cards cost $2");
    }
  };

  const handleOpenPlayerPack = () => {
    if (money >= 4) {
      setShowPlayerPack(true);
      // Deduct $4 when opening the pack
      setMoney(prev => prev - 4);
    } else {
      alert("Not enough money! Player Packs cost $4");
    }
  };

  const handleOpenCoachPack = () => {
    if (money >= 4) {
      setShowCoachPack(true);
      // Deduct $4 when opening the pack
      setMoney(prev => prev - 4);
    } else {
      alert("Not enough money! Coach Packs cost $4");
    }
  };

  if (showPlayerPack) {
    return (
      <PlayerPackSelection 
        onBack={() => setShowPlayerPack(false)} 
        setCurrentPlayers={setCurrentPlayers}
        currentPlayers={currentPlayers}
      />
    );
  }

  if (showCoachPack) {
    return (
      <CoachPackSelection 
        onBack={() => setShowCoachPack(false)}
        currentPlayers={currentPlayers}
        setCurrentPlayers={setCurrentPlayers}
        setActiveCoachEffects={setActiveCoachEffects}
      />
    );
  }

  return (
    <div className="shop-container">
      {/* Add Money Display */}
      <div className="shop-money-display">
        <h2 className="money-title">Available Money: ${money}</h2>
      </div>

      {/* Owned Cards Section */}
      <div className="shop-section">
        <h2 className="shop-title">Your Collection ({ownedCards.length}/5)</h2>
        <div className="owned-cards">
          {ownedCards.length > 0 ? (
            ownedCards.map(cardId => (
              <motion.div
                key={cardId}
                className="jokic-card"
                whileHover={{ scale: 1.05 }}
              >
                <div className="jokic-card-content">
                  <h3>{jokicCards[cardId].name}</h3>
                  <p className="jokic-card-effect">{jokicCards[cardId].effect}</p>
                  <Button 
                    onClick={() => onSell(cardId)}
                    className="button-red"
                  >
                    Sell
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-cards-message">
              No cards in collection
            </div>
          )}
        </div>
      </div>

      {/* Available Jokic Cards Section */}
      <div className="shop-section">
        <h2 className="shop-title">Jokic Cards</h2>
        <div className="shop-cards">
          {availableCards.map(cardId => (
            <motion.div
              key={cardId}
              className="jokic-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="jokic-card-content">
                <h3>{jokicCards[cardId].name}</h3>
                <p className="jokic-card-effect">{jokicCards[cardId].effect}</p>
                <Button 
                  onClick={() => handlePurchase({ id: cardId })}
                  className="button-green"
                  disabled={money < 2}
                >
                  Purchase ($2)
                </Button>
                {money < 2 && (
                  <p className="text-red-500 text-sm mt-2">Not enough money</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <Button 
          onClick={onReroll}
          className="button-yellow"
          style={{ marginTop: '1rem', width: '100%' }}
          disabled={money < 2}
        >
          Reroll Shop ($2)
        </Button>
      </div>

      {/* Packs Section */}
      <div className="shop-section packs-section">
        <h2 className="shop-title">Card Packs</h2>
        <div className="pack-options">
          <div 
            className={`pack-option players ${money < 4 ? 'disabled' : ''}`}
            onClick={handleOpenPlayerPack}
          >
            <h3>Player Pack</h3>
            <p>Unlock new players for your roster</p>
            <span className="pack-price">$4</span>
            {money < 4 && <p className="insufficient-funds">Not enough money</p>}
          </div>
          <div 
            className={`pack-option coaching ${money < 4 ? 'disabled' : ''}`}
            onClick={handleOpenCoachPack}
          >
            <h3>Coach Pack</h3>
            <p>Unlock powerful team strategies</p>
            <span className="pack-price">$4</span>
            {money < 4 && <p className="insufficient-funds">Not enough money</p>}
          </div>
        </div>
      </div>
    </div>
  );
} 