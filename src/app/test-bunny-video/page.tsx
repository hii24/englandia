'use client';

import React, { useState } from 'react';
import { BunnyVideoPlayer } from '@/components/ui/BunnyVideoPlayer';

export default function TestBunnyVideoPage() {
  const [videoId, setVideoId] = useState('d2a2d931-f32e-48a4-8d76-20b1f2f714cc');
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Тест Bunny.net Video Player</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Настройки</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Код видео (Video ID):
              </label>
              <input
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="d2a2d931-f32e-48a4-8d76-20b1f2f714cc"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="mr-2"
                />
                Автовоспроизведение
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="mr-2"
                />
                Зацикливание
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={(e) => setMuted(e.target.checked)}
                  className="mr-2"
                />
                Без звука
              </label>
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Текущие настройки:</h3>
            <pre className="text-sm">
              {JSON.stringify({
                videoId,
                autoplay,
                loop,
                muted
              }, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* Имитация карточки урока */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Имитация карточки урока</h2>
          
          {/* Материалы (как в уроке) */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Учебные материалы урока:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <a href="#" className="text-violet-700 underline font-medium">Презентация урока</a>
              </li>
              <li>
                <a href="#" className="text-violet-700 underline font-medium">Дополнительные материалы</a>
              </li>
            </ul>
          </div>
          
          {/* Домашнее задание */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Домашнее задание:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <a href="#" className="text-violet-700 underline font-medium">Выполнить упражнения</a>
              </li>
            </ul>
          </div>
          
          {/* Видео в конце */}
          {videoId ? (
            <div className="video-section">
              <BunnyVideoPlayer
                videoId={videoId}
                autoplay={autoplay}
                loop={loop}
                muted={muted}
                className="border border-gray-300 rounded-lg overflow-hidden"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Введите код видео для отображения плеера
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Инструкция:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Зайдите в <a href="https://dash.bunny.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">dash.bunny.net</a></li>
          <li>Загрузите видео в вашу библиотеку</li>
          <li>Скопируйте код видео (GUID)</li>
          <li>Вставьте код в поле выше</li>
          <li>Настройте параметры воспроизведения</li>
        </ol>
      </div>

      <style jsx>{`
        .video-section {
          margin-top: 32px;
          margin-bottom: 0;
          border-top: 2px solid #ede9fe;
          padding-top: 24px;
        }
        .video-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .video-title::before {
          content: "🎥";
          font-size: 20px;
        }
      `}</style>
    </div>
  );
} 