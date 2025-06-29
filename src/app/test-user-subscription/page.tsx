'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function TestUserSubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore(s => s.user);

  const testCurrentUser = async () => {
    if (!user?._id) {
      setError('Пользователь не найден');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/debug/test-user-subscription?userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log('✅ Test result:', data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Error testing subscription:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      testCurrentUser();
    }
  }, [user?._id]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Тест подписки пользователя</h1>
        <div className="card">
          <p className="text-center text-gray-600">Пользователь не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тест подписки пользователя</h1>
      
      <div className="mb-8">
        <button
          onClick={testCurrentUser}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Проверяем...' : 'Проверить подписку'}
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
          {/* Информация о пользователе */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Имя:</strong> {result.user.firstName} {result.user.lastName}
              </div>
              <div>
                <strong>Email:</strong> {result.user.email}
              </div>
              <div>
                <strong>Роль:</strong> {result.user.role}
              </div>
              <div>
                <strong>Есть поле subscription:</strong> {result.user.hasSubscription ? '✅' : '❌'}
              </div>
              <div>
                <strong>ID подписки:</strong> {result.user.subscriptionId || '—'}
              </div>
            </div>
          </div>

          {/* Информация о подписке */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Информация о подписке</h2>
            {result.subscription ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>ID подписки:</strong> {result.subscription._id}
                </div>
                <div>
                  <strong>Тип:</strong> {result.subscription.type}
                </div>
                <div>
                  <strong>Статус:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                    result.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {result.subscription.status}
                  </span>
                </div>
                <div>
                  <strong>Уроков/мес:</strong> {result.subscription.lessonsPerMonth}
                </div>
                <div>
                  <strong>User ID в подписке:</strong> {result.subscription.userId}
                </div>
                <div>
                  <strong>Дата начала:</strong> {new Date(result.subscription.startDate).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Подписка не найдена</p>
            )}
          </div>

          {/* Название пакета */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Название пакета</h2>
            <div className="text-lg font-medium">
              {result.packageName}
            </div>
          </div>

          {/* Отладочная информация */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Отладочная информация</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Поле subscription пользователя:</strong> {result.debug.userSubscriptionField || '—'}
              </div>
              <div>
                <strong>Подписка найдена:</strong> {result.debug.subscriptionFound ? '✅' : '❌'}
              </div>
              <div>
                <strong>ID совпадают:</strong> {result.debug.subscriptionIdMatch ? '✅' : '❌'}
              </div>
            </div>
          </div>

          {/* Все подписки в базе */}
          {result.allSubscriptions.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Все подписки в базе ({result.allSubscriptions.length})
              </h2>
              <div className="space-y-2">
                {result.allSubscriptions.map((sub: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>Подписка {index + 1}:</strong> {sub._id}
                      </div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 text-xs rounded ${
                          sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Тип: {sub.type} | User ID: {sub.userId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 