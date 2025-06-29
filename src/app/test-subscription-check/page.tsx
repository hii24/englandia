'use client';

import React, { useState } from 'react';

interface Subscription {
  _id: string;
  type: string;
  status: string;
  lessonsPerMonth: number;
  startDate: string;
  userId: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hasSubscriptionField: boolean;
  subscriptionFieldValue: string;
}

interface SubscriptionCheckResult {
  totalSubscriptions: number;
  subscriptions: Subscription[];
  usersWithSubscriptions: Array<{
    subscription: Subscription;
    user: User;
    subscriptionMatch: boolean;
  }>;
  usersWithSubscriptionField: Array<{
    user: User;
    subscriptionExists: boolean;
  }>;
  summary: {
    activeSubscriptions: number;
    basicSubscriptions: number;
    intensiveSubscriptions: number;
    matchedUsers: number;
    unmatchedUsers: number;
    orphanedSubscriptionFields: number;
  };
}

export default function TestSubscriptionCheckPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubscriptionCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkSubscriptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/check-subscriptions');
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log('✅ Subscription check result:', data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Error checking subscriptions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Проверка подписок в базе данных</h1>
      
      <div className="mb-8">
        <button
          onClick={checkSubscriptions}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Проверяем...' : 'Проверить подписки'}
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
            <h2 className="text-xl font-semibold mb-4">Сводка</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.totalSubscriptions}</div>
                <div className="text-sm text-blue-700">Всего подписок</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.summary.activeSubscriptions}</div>
                <div className="text-sm text-green-700">Активных</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{result.summary.matchedUsers}</div>
                <div className="text-sm text-purple-700">Совпадающих</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.summary.orphanedSubscriptionFields}</div>
                <div className="text-sm text-red-700">Осиротевших полей</div>
              </div>
            </div>
          </div>

          {/* Пользователи с подписками */}
          {result.usersWithSubscriptions.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Пользователи с подписками ({result.usersWithSubscriptions.length})
              </h2>
              <div className="space-y-4">
                {result.usersWithSubscriptions.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg ${
                      item.subscriptionMatch ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {item.user.firstName} {item.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{item.user.email}</p>
                        <p className="text-sm text-gray-600">Роль: {item.user.role}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.subscriptionMatch ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.subscriptionMatch ? '✅ Совпадает' : '❌ Не совпадает'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Подписка:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>Тип: {item.subscription.type}</li>
                          <li>Статус: {item.subscription.status}</li>
                          <li>Уроков/мес: {item.subscription.lessonsPerMonth}</li>
                          <li>ID: {item.subscription._id}</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Поле subscription:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>Есть поле: {item.user.hasSubscriptionField ? '✅' : '❌'}</li>
                          <li>Значение: {item.user.subscriptionFieldValue || '—'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Пользователи с осиротевшими полями subscription */}
          {result.usersWithSubscriptionField.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Пользователи с осиротевшими полями subscription ({result.usersWithSubscriptionField.length})
              </h2>
              <div className="space-y-4">
                {result.usersWithSubscriptionField.map((item, index) => (
                  <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {item.user.firstName} {item.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{item.user.email}</p>
                        <p className="text-sm text-gray-600">Роль: {item.user.role}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        ❌ Осиротевшее поле
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Поле subscription:</strong> {item.user.subscriptionFieldValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Все подписки */}
          {result.subscriptions.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Все подписки в базе ({result.subscriptions.length})
              </h2>
              <div className="space-y-4">
                {result.subscriptions.map((subscription, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Подписка {index + 1}</h3>
                        <p className="text-sm text-gray-600">ID: {subscription._id}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${
                          subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Детали:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>Тип: {subscription.type}</li>
                          <li>Уроков/мес: {subscription.lessonsPerMonth}</li>
                          <li>Дата начала: {new Date(subscription.startDate).toLocaleDateString()}</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Связи:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>User ID: {subscription.userId}</li>
                        </ul>
                      </div>
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