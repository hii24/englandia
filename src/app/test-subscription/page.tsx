'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  subscription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TestSubscriptionPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [subscriptionType, setSubscriptionType] = useState<'basic' | 'intensive'>('basic');
  const [results, setResults] = useState<string[]>([]);
  const user = useUserStore(s => s.user);

  // Загружаем пользователей
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  // Создаем тестовую подписку
  const createTestSubscription = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/debug/create-test-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          subscriptionType: subscriptionType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Тестовая подписка создана:', data);
        addResult(`✅ Подписка создана: ${data.subscription.type} (${data.subscription.lessonsPerMonth} уроков/мес)`);
        addResult(`👤 Пользователь: ${data.user.firstName} ${data.user.lastName} (${data.user.role})`);
        loadUsers(); // Перезагружаем список
      } else {
        const error = await response.json();
        console.error('❌ Ошибка создания подписки:', error);
        addResult(`❌ Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
      addResult(`❌ Ошибка сети: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Проверяем информацию о подписке
  const checkSubscription = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/subscription?userId=${selectedUser}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Информация о подписке:', data);
        addResult(`📦 Пакет: ${data.packageName}`);
        addResult(`👤 Роль: ${data.userRole}`);
        if (data.subscription) {
          addResult(`📊 Подписка: ${data.subscription.type} (${data.subscription.lessonsPerMonth} уроков/мес)`);
          addResult(`📅 Статус: ${data.subscription.status}`);
        }
      } else {
        const error = await response.json();
        console.error('❌ Ошибка получения подписки:', error);
        addResult(`❌ Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
      addResult(`❌ Ошибка сети: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const guestUsers = users.filter(user => user.role === 'guest');
  const studentUsers = users.filter(user => user.role === 'student');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тест создания подписки</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Пользователи с ролью "Гость"</h2>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Загрузка...</p>
            </div>
          ) : guestUsers.length > 0 ? (
            <div className="space-y-2">
              {guestUsers.map(user => (
                <div 
                  key={user._id} 
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedUser === user._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedUser(user._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Нет пользователей с ролью "Гость"</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Пользователи с ролью "Студент"</h2>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Загрузка...</p>
            </div>
          ) : studentUsers.length > 0 ? (
            <div className="space-y-2">
              {studentUsers.map(user => (
                <div 
                  key={user._id} 
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedUser === user._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedUser(user._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Подписка: {user.subscription ? '✅' : '❌'}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Нет пользователей с ролью "Студент"</p>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-4">Управление подпиской</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Создать тестовую подписку</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип подписки:
                  </label>
                  <select
                    value={subscriptionType}
                    onChange={(e) => setSubscriptionType(e.target.value as 'basic' | 'intensive')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="basic">Базовый (4 урока/мес)</option>
                    <option value="intensive">Интенсивный (8 уроков/мес)</option>
                  </select>
                </div>
                
                <button
                  onClick={createTestSubscription}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Создаем...' : 'Создать подписку'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Проверить подписку</h3>
              
              <button
                onClick={checkSubscription}
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Проверяем...' : 'Проверить подписку'}
              </button>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-4">Результаты</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                {result}
              </div>
            ))}
          </div>
          <button
            onClick={() => setResults([])}
            className="mt-4 btn-secondary"
          >
            Очистить
          </button>
        </div>
      )}

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Информация</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-700">📦 Типы подписок:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• <strong>Базовый:</strong> 4 урока в месяц</li>
              <li>• <strong>Интенсивный:</strong> 8 уроков в месяц</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-700">✅ Что происходит при создании подписки:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Создается запись в коллекции Subscription</li>
              <li>• Обновляется поле subscription в модели User</li>
              <li>• Роль изменяется с "guest" на "student" (если была "guest")</li>
              <li>• В интерфейсе отображается название пакета</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-purple-700">🔍 API endpoints:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• <code>POST /api/debug/create-test-subscription</code> - создание тестовой подписки</li>
              <li>• <code>GET /api/users/subscription?userId=...</code> - получение информации о подписке</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 