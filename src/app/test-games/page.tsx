'use client';

import React, { useState } from 'react';
import { GameGrid } from '@/components/ui/GameGrid';
import { LessonGame } from '@/components/LessonCard/LessonCard.types';

export default function TestGamesPage() {
  const [games, setGames] = useState<LessonGame[]>([
    {
      title: 'Тестовая игра 1',
      iframeUrl: 'https://www.google.com',
      description: 'Описание первой игры',
      forStudent: true
    },
    {
      title: 'Тестовая игра 2',
      iframeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Описание второй игры',
      forStudent: true
    }
  ]);

  const [newGame, setNewGame] = useState<LessonGame>({
    title: '',
    iframeUrl: '',
    description: '',
    forStudent: true
  });

  const addGame = () => {
    if (newGame.title && newGame.iframeUrl) {
      setGames([...games, newGame]);
      setNewGame({
        title: '',
        iframeUrl: '',
        description: '',
        forStudent: true
      });
    }
  };

  const removeGame = (index: number) => {
    setGames(games.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Тест игр для уроков</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Добавить новую игру</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название игры</label>
            <input
              type="text"
              value={newGame.title}
              onChange={(e) => setNewGame({...newGame, title: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Введите название игры"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL для iframe</label>
            <input
              type="text"
              value={newGame.iframeUrl}
              onChange={(e) => setNewGame({...newGame, iframeUrl: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="https://example.com/game"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={newGame.description}
              onChange={(e) => setNewGame({...newGame, description: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              rows={2}
              placeholder="Описание игры"
            />
          </div>
          <button
            onClick={addGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Добавить игру
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Список игр</h2>
        <div className="space-y-2">
          {games.map((game, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <strong>{game.title}</strong>
                <p className="text-sm text-gray-600">{game.iframeUrl}</p>
                {game.description && (
                  <p className="text-sm text-gray-500">{game.description}</p>
                )}
              </div>
              <button
                onClick={() => removeGame(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Отображение игр (GameGrid)</h2>
        <GameGrid games={games} />
      </div>
    </div>
  );
} 