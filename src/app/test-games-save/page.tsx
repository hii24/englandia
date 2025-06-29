'use client';

import React, { useState } from 'react';
import { createLesson } from '@/lib/api';

export default function TestGamesSavePage() {
  const [testData, setTestData] = useState({
    title: 'Тестовый урок с играми',
    description: 'Описание тестового урока',
    orderNumber: 999,
    bunnyVideoId: 'test-video-id',
    games: [
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
    ],
    materials: [],
    additionalMaterials: [],
    homework: []
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestSave = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 TestGamesSavePage: Отправляем тестовые данные:', JSON.stringify(testData, null, 2));
      
      const response = await createLesson(testData);
      
      console.log('🔍 TestGamesSavePage: Ответ сервера:', response);
      setResult(response);
      
      // Обновляем orderNumber для следующего теста
      setTestData(prev => ({
        ...prev,
        orderNumber: prev.orderNumber + 1
      }));
      
    } catch (err: any) {
      console.error('❌ TestGamesSavePage: Ошибка:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Тест сохранения игр</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Тестовые данные</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <button
          onClick={handleTestSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Сохранение...' : 'Сохранить тестовый урок'}
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Ошибка</h2>
          <div className="bg-red-100 p-4 rounded text-red-700">
            {error}
          </div>
        </div>
      )}

      {result && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Результат</h2>
          <div className="bg-green-100 p-4 rounded">
            <p className="font-semibold">Урок успешно создан!</p>
            <p>ID: {result._id}</p>
            <p>Название: {result.title}</p>
            <p>Количество игр: {result.games?.length || 0}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Полный ответ</summary>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Инструкции</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Нажмите кнопку "Сохранить тестовый урок"</li>
          <li>Проверьте консоль браузера на наличие логов</li>
          <li>Проверьте результат сохранения выше</li>
          <li>Если есть ошибки, они отобразятся в разделе "Ошибка"</li>
        </ol>
      </div>
    </div>
  );
} 