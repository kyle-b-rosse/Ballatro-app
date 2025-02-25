import React from 'react';
import { Button } from './BasketballCardGameApp';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1>Welcome to Ball-atro</h1>
        
        <div className="rules-section">
          <h2>How to Play</h2>
          
          <div className="rule-block">
            <h3>Game Basics</h3>
            <ul>
              <li>Each series has 3 games with increasing score targets</li>
              <li>Win games by reaching the target score with your lineup</li>
              <li>Earn money for victories and unused substitutions</li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>Building Your Team</h3>
            <ul>
              <li>Set a lineup of 5 players in their proper positions</li>
              <li>Players in their natural position get a 1.25x bonus</li>
              <li>Only players with games scheduled today will score points</li>
              <li>You have 3 substitutions per game to swap players</li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>Power Ups</h3>
            <ul>
              <li>Buy Jokic Cards to apply powerful multipliers and effects</li>
              <li>Purchase Coach Cards to boost individual player stats</li>
              <li>Use Skip Days to find better matchups (5 skips per series)</li>
            </ul>
          </div>
        </div>

        <Button 
          onClick={onStart}
          className="button-green start-button"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
} 