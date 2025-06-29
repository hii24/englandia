'use client';

import React, { useState } from 'react';

export default function FixSubscriptionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fixSubscriptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/fix-subscriptions', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log('✅ Fix result:', data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Error fixing subscriptions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Исправление подписок</h1>
      
      <div className="mb-8">
        <button
          onClick={fixSubscriptions}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Исправляем...' : 'Исправить подписки'}
        </button>
      </div>

      {error && (
        <div className="card mb-8 bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Ошибка</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          {/* Сводка */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Результат исправления</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.summary.fixedUsers}</div>
                <div className="text-sm text-green-700">Исправлено пользователей</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{result.summary.orphanedSubscriptions}</div>
                <div className="text-sm text-yellow-700">Осиротевших подписок</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.summary.errors}</div>
                <div className="text-sm text-red-700">Ошибок</div>
              </div>
            </div>
          </div>

          {/* Исправленные пользователи */}
          {result.results.fixedUsers.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Исправленные пользователи ({result.results.fixedUsers.length})
              </h2>
              <div className="space-y-2">
                {result.results.fixedUsers.map((item: any, index: number) => (
                  <div key={index} className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {item.userName}
                        </h3>
                        <p className="text-sm text-gray-600">{item.userEmail}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        ✅ Исправлено
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Действие:</strong> {item.action}
                    </div>
                    {item.subscriptionType && (
                      <div className="mt-1 text-sm">
                        <strong>Тип подписки:</strong> {item.subscriptionType}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Осиротевшие подписки */}
          {result.results.orphanedSubscriptions.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Осиротевшие подписки ({result.results.orphanedSubscriptions.length})
              </h2>
              <div className="space-y-2">
                {result.results.orphanedSubscriptions.map((item: any, index: number) => (
                  <div key={index} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          Подписка {index + 1}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {item.subscriptionId}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                        ⚠️ Осиротевшая
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Тип:</strong> {item.subscriptionType}
                    </div>
                    <div className="mt-1 text-sm">
                      <strong>User ID:</strong> {item.userId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ошибки */}
          {result.results.errors.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Ошибки ({result.results.errors.length})
              </h2>
              <div className="space-y-2">
                {result.results.errors.map((item: any, index: number) => (
                  <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          Ошибка {index + 1}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {item.subscriptionId}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        ❌ Ошибка
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Ошибка:</strong> {item.error}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Информация</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-700">🔧 Что делает этот инструмент:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Проверяет все подписки в базе данных</li>
              <li>• Исправляет неправильные ссылки на подписки у пользователей</li>
              <li>• Удаляет осиротевшие поля subscription у пользователей</li>
              <li>• Находит подписки без пользователей</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-700">✅ Когда использовать:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Пакет не отображается после оформления подписки</li>
              <li>• Есть ошибки в связях между пользователями и подписками</li>
              <li>• После миграции данных или обновления схемы</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 