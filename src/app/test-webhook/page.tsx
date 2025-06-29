'use client';

import React, { useState } from 'react';

export default function TestWebhookPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Тест 1: Проверяем переменные окружения
  const testEnvironmentVariables = async () => {
    setLoading(true);
    try {
      addResult('🔍 Проверяем переменные окружения...');
      
      const response = await fetch('/api/debug/test-stripe-config');
      const data = await response.json();
      
      if (response.ok) {
        addResult('✅ Конфигурация Stripe:');
        addResult(`   - STRIPE_SECRET_KEY: ${data.hasSecretKey ? '✅' : '❌'}`);
        addResult(`   - STRIPE_WEBHOOK_SECRET: ${data.hasWebhookSecret ? '✅' : '❌'}`);
        addResult(`   - STRIPE_BASIC_PRICE_ID: ${data.hasBasicPriceId ? '✅' : '❌'}`);
        addResult(`   - STRIPE_INTENSIVE_PRICE_ID: ${data.hasIntensivePriceId ? '✅' : '❌'}`);
      } else {
        addResult('❌ Ошибка проверки конфигурации');
      }
    } catch (error) {
      addResult(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 2: Проверяем webhook endpoint
  const testWebhookEndpoint = async () => {
    setLoading(true);
    try {
      addResult('🔍 Проверяем webhook endpoint...');
      
      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test-signature'
        },
        body: JSON.stringify({ test: true })
      });
      
      if (response.status === 400) {
        addResult('✅ Webhook endpoint доступен (ожидаемая ошибка подписи)');
      } else {
        addResult(`⚠️ Webhook endpoint вернул статус: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Webhook endpoint недоступен: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 3: Симулируем webhook событие
  const simulateWebhookEvent = async () => {
    setLoading(true);
    try {
      addResult('🎭 Симулируем webhook событие checkout.session.completed...');
      
      const response = await fetch('/api/debug/simulate-stripe-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '68603c91fc0d6a6d785f5f8b', // Тестовый пользователь
          eventType: 'checkout.session.completed'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult('✅ Webhook событие симулировано успешно');
        addResult(`   - Старая роль: ${data.user.oldRole}`);
        addResult(`   - Новая роль: ${data.user.role}`);
        addResult(`   - Пользователь: ${data.user.firstName} ${data.user.lastName}`);
      } else {
        addResult(`❌ Ошибка симуляции: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 4: Проверяем пользователей
  const checkUsers = async () => {
    setLoading(true);
    try {
      addResult('👥 Проверяем пользователей...');
      
      const response = await fetch('/api/debug/users');
      const data = await response.json();
      
      if (response.ok) {
        const guestUsers = data.users.filter((u: any) => u.role === 'guest');
        const studentUsers = data.users.filter((u: any) => u.role === 'student');
        
        addResult(`📊 Статистика пользователей:`);
        addResult(`   - Гости: ${guestUsers.length}`);
        addResult(`   - Студенты: ${studentUsers.length}`);
        
        if (guestUsers.length > 0) {
          addResult(`   - Пример гостя: ${guestUsers[0].firstName} ${guestUsers[0].lastName} (${guestUsers[0].email})`);
        }
        if (studentUsers.length > 0) {
          addResult(`   - Пример студента: ${studentUsers[0].firstName} ${studentUsers[0].lastName} (${studentUsers[0].email})`);
        }
      } else {
        addResult('❌ Ошибка получения пользователей');
      }
    } catch (error) {
      addResult(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 5: Проверяем создание checkout session
  const testCheckoutSession = async () => {
    setLoading(true);
    try {
      addResult('💳 Тестируем создание checkout session...');
      
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType: 'BASIC',
          userId: '68603c91fc0d6a6d785f5f8b'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult('✅ Checkout session создан успешно');
        addResult(`   - Session ID: ${data.sessionId}`);
        addResult(`   - URL: ${data.url?.substring(0, 50)}...`);
      } else {
        addResult(`❌ Ошибка создания session: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Диагностика Webhook и изменения ролей</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Проверка конфигурации</h2>
          <div className="space-y-3">
            <button
              onClick={testEnvironmentVariables}
              disabled={loading}
              className="btn-primary w-full"
            >
              Проверить переменные окружения
            </button>
            
            <button
              onClick={testWebhookEndpoint}
              disabled={loading}
              className="btn-secondary w-full"
            >
              Проверить webhook endpoint
            </button>
            
            <button
              onClick={testCheckoutSession}
              disabled={loading}
              className="btn-secondary w-full"
            >
              Тест создания checkout session
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Тестирование логики</h2>
          <div className="space-y-3">
            <button
              onClick={checkUsers}
              disabled={loading}
              className="btn-primary w-full"
            >
              Проверить пользователей
            </button>
            
            <button
              onClick={simulateWebhookEvent}
              disabled={loading}
              className="btn-secondary w-full"
            >
              Симулировать webhook событие
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Результаты диагностики</h2>
          <button
            onClick={clearResults}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Очистить
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Нажмите кнопки выше для начала диагностики
            </p>
          ) : (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Возможные причины проблемы</h2>
        <div className="space-y-3 text-sm">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-red-700">1. Webhook не настроен</h3>
            <p className="text-gray-600">Проверьте переменную STRIPE_WEBHOOK_SECRET и настройку webhook в Stripe Dashboard</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-yellow-700">2. Webhook недоступен</h3>
            <p className="text-gray-600">Stripe не может достучаться до вашего webhook endpoint</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-blue-700">3. Неправильные метаданные</h3>
            <p className="text-gray-600">userId не передается в метаданных checkout session</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-green-700">4. Ошибка в базе данных</h3>
            <p className="text-gray-600">Пользователь не найден или ошибка при обновлении роли</p>
          </div>
        </div>
      </div>
    </div>
  );
} 