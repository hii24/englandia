'use client';

import React, { useState } from 'react';

export default function TestStripeLinksPage() {
  const [links, setLinks] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCreateLinks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType: 'BASIC',
          userId: 'test-user-id'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setLinks(data);
        console.log('✅ Ссылки созданы успешно:', data);
      } else {
        setError(data.error || 'Ошибка создания ссылок');
        console.error('❌ Ошибка создания ссылок:', data);
      }
    } catch (err) {
      setError('Ошибка сети');
      console.error('❌ Ошибка сети:', err);
    } finally {
      setLoading(false);
    }
  };

  const testEmailFunction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/test-subscription-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 'test-student-id',
          studentEmail: 'test@example.com',
          studentName: 'Тестовый Студент',
          lessonTitle: 'Тестовый урок'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setLinks(data);
        console.log('✅ Email функция работает:', data);
      } else {
        setError(data.error || 'Ошибка тестирования email');
        console.error('❌ Ошибка email функции:', data);
      }
    } catch (err) {
      setError('Ошибка сети');
      console.error('❌ Ошибка сети:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тест создания ссылок Stripe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Тест API создания ссылок</h2>
          
          <button
            onClick={testCreateLinks}
            disabled={loading}
            className="btn-primary w-full mb-4"
          >
            {loading ? 'Создаем ссылки...' : 'Создать ссылку на подписку'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {links && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Результат:</h3>
              <pre className="text-sm text-green-700 overflow-auto">
                {JSON.stringify(links, null, 2)}
              </pre>
              {links.url && (
                <a 
                  href={links.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Открыть ссылку Stripe
                </a>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Тест email функции</h2>
          
          <button
            onClick={testEmailFunction}
            disabled={loading}
            className="btn-secondary w-full mb-4"
          >
            {loading ? 'Тестируем...' : 'Тест функции email'}
          </button>

          <div className="text-sm text-gray-600">
            <p>Эта функция протестирует:</p>
            <ul className="mt-2 space-y-1">
              <li>• Создание ссылок на Stripe</li>
              <li>• Генерацию email с ссылками</li>
              <li>• Вывод в консоль (режим разработки)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Проверка переменных окружения</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Обязательные переменные:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• STRIPE_SECRET_KEY</li>
              <li>• STRIPE_PUBLISHABLE_KEY</li>
              <li>• STRIPE_WEBHOOK_SECRET</li>
              <li>• STRIPE_BASIC_PRICE_ID</li>
              <li>• STRIPE_INTENSIVE_PRICE_ID</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Email переменные (опционально):</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• EMAIL_USER</li>
              <li>• EMAIL_PASSWORD</li>
              <li>• EMAIL_FROM</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Важно:</strong> Если переменные окружения не настроены, 
            ссылки на Stripe не будут создаваться, и в email не будет кнопок для оплаты.
          </p>
        </div>
      </div>
    </div>
  );
} 