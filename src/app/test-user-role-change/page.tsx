'use client';

import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export default function TestUserRoleChangePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newRole, setNewRole] = useState<'student' | 'guest'>('student');

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

  // Изменяем роль пользователя
  const changeUserRole = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/debug/change-user-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          newRole: newRole
        }),
      });

      if (response.ok) {
        console.log('✅ Роль пользователя изменена успешно');
        loadUsers(); // Перезагружаем список
      } else {
        const error = await response.json();
        console.error('❌ Ошибка изменения роли:', error);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
    } finally {
      setLoading(false);
    }
  };

  // Симулируем webhook событие
  const simulateWebhook = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch('/api/debug/simulate-stripe-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          eventType: 'checkout.session.completed'
        }),
      });

      if (response.ok) {
        console.log('✅ Webhook событие симулировано');
        loadUsers(); // Перезагружаем список
      } else {
        const error = await response.json();
        console.error('❌ Ошибка симуляции webhook:', error);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const guestUsers = users.filter(user => user.role === 'guest');
  const studentUsers = users.filter(user => user.role === 'student');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тест изменения роли пользователя</h1>
      
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
          <h2 className="text-xl font-semibold mb-4">Управление выбранным пользователем</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Ручное изменение роли</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Новая роль:
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'student' | 'guest')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="student">Студент</option>
                    <option value="guest">Гость</option>
                  </select>
                </div>
                
                <button
                  onClick={changeUserRole}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Изменяем...' : 'Изменить роль'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Симуляция webhook</h3>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Симулирует успешную оплату подписки и изменение роли с "Гость" на "Студент"
                </p>
                
                <button
                  onClick={simulateWebhook}
                  disabled={loading}
                  className="btn-secondary w-full"
                >
                  {loading ? 'Симулируем...' : 'Симулировать успешную оплату'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Информация о логике изменения ролей</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-green-700">✅ Успешная оплата подписки:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Webhook: <code>checkout.session.completed</code></li>
              <li>• Действие: Роль изменяется с "guest" на "student"</li>
              <li>• Логика: В <code>/api/webhooks/stripe.ts</code></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-red-700">❌ Отмена подписки:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Webhook: <code>customer.subscription.canceled</code></li>
              <li>• Действие: Роль изменяется с "student" на "guest"</li>
              <li>• Логика: В <code>/api/webhooks/stripe.ts</code></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-red-700">❌ Удаление подписки:</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Webhook: <code>customer.subscription.deleted</code></li>
              <li>• Действие: Роль изменяется с "student" на "guest"</li>
              <li>• Логика: В <code>/api/webhooks/stripe.ts</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 