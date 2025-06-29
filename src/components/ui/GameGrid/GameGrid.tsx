import React from 'react';
import { LessonGame } from '@/components/LessonCard/LessonCard.types';

interface GameGridProps {
  games: LessonGame[];
  className?: string;
}

export const GameGrid: React.FC<GameGridProps> = ({ games, className = '' }) => {
  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div className={`game-grid ${className}`}>
      <h4 className="game-grid__title">Игры для урока</h4>
      <div className="game-grid__container">
        {games.map((game, index) => (
          <div key={index} className="game-grid__item">
            <div className="game-grid__header">
              <h5 className="game-grid__game-title">{game.title}</h5>
              {game.description && (
                <p className="game-grid__description">{game.description}</p>
              )}
            </div>
            <div className="game-grid__iframe-container">
              <iframe
                src={game.iframeUrl}
                title={game.title}
                className="game-grid__iframe"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .game-grid {
         
          margin-bottom: 0;
        
          padding-top: 24px;
        }
        
        .game-grid__title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .game-grid__title::before {
          content: "🎮";
          font-size: 20px;
        }
        
        .game-grid__container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .game-grid__item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .game-grid__header {
          padding: 16px;
         
        }
        
        .game-grid__game-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        
        .game-grid__description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }
        
        .game-grid__iframe-container {
          position: relative;
          width: 100%;
          height: 300px;
        }
        
        .game-grid__iframe {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0 0 12px 12px;
        }
        
        @media (max-width: 768px) {
          .game-grid__container {
            grid-template-columns: 1fr;
          }
          
          .game-grid__iframe-container {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}; 