'use client';

import AuthGuard from '@/components/AuthGuard';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { BurgerMenuButton } from '@/components/ui';
import React, { useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Eng-Landia Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Выйти
                </button>
                <BurgerMenuButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
              </div>
            </div>
          </div>
          {/* Мобильное меню */}
          {menuOpen && (
            <nav className="md:hidden bg-white border-t px-4 py-2">
              <ul>
                <li><a href="/dashboard" className="block py-2">Главная</a></li>
                <li><a href="/profile" className="block py-2">Профиль</a></li>
                <li><button onClick={handleLogout} className="block py-2 text-red-600">Выйти</button></li>
              </ul>
            </nav>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Информация о пользователе
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Имя</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Телефон</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Возраст</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.age}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Роль</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user?.role === 'student' && 'Студент'}
                      {user?.role === 'teacher' && 'Учитель'}
                      {user?.role === 'admin' && 'Администратор'}
                      {user?.role === 'guest' && 'Гость'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email подтвержден</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user?.isEmailVerified ? 'Да' : 'Нет'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Content based on role */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Добро пожаловать в Eng-Landia!
                </h3>
                
                {user?.role === 'guest' && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Вы зарегистрированы как гость. После прохождения первого урока 
                      вы получите доступ к полному курсу.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                      Начать первый урок
                    </button>
                  </div>
                )}

                {user?.role === 'student' && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Как студент, вы можете просматривать доступные уроки и отслеживать свой прогресс.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Мои уроки
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Мой прогресс
                      </button>
                    </div>
                  </div>
                )}

                {user?.role === 'teacher' && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Как учитель, вы можете управлять своими учениками и уроками.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Мои ученики
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Расписание
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Управление уроками
                      </button>
                    </div>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Как администратор, у вас есть полный доступ к управлению платформой.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Пользователи
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Уроки
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Подписки
                      </button>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                        Статистика
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 