'use client';

import React from 'react';
import { BurgerMenuHome } from '../BurgerMenuHome';
import { BurgerMenuDashboard } from '../BurgerMenuDashboard';
import { BurgerMenu } from '../ui/BurgerMenu';
import { useBurgerMenu } from '@/hooks/useBurgerMenu';
import { useUserStore } from '@/store/userStore';

export const BurgerMenuExamples: React.FC = () => {
  const { isOpen, toggle } = useBurgerMenu();
  const { isAuthenticated } = useUserStore();

  // Пример кастомного бургер-меню
  const customBurgerMenu = useBurgerMenu();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Примеры бургер-меню</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Текущий статус: {isAuthenticated ? 'Авторизован' : 'Не авторизован'}
        </h3>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Бургер-меню автоматически показывает разное содержимое в зависимости от статуса авторизации.
          </p>
          <p className="text-sm text-gray-600">
            На мобильных устройствах (≤768px) кнопка бургер-меню будет видна в правом верхнем углу.
          </p>
        </div>
      </div>

      {/* Бургер-меню будет отображаться в правом верхнем углу на мобильных устройствах */}
      {isAuthenticated ? (
        <BurgerMenuDashboard isOpen={isOpen} onToggle={toggle} />
      ) : (
        <BurgerMenuHome isOpen={isOpen} onToggle={toggle} />
      )}

      {/* Пример кастомного пустого бургер-меню */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-4">Пример кастомного бургер-меню:</h4>
        <button 
          onClick={customBurgerMenu.toggle}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Открыть кастомное меню
        </button>
        
        <BurgerMenu isOpen={customBurgerMenu.isOpen} onToggle={customBurgerMenu.toggle}>
          <div className="burger-menu-authenticated">
            <h4 className="burger-menu-section-title">Кастомное меню</h4>
            <button className="burger-menu-item">
              Кастомная кнопка 1
            </button>
            <button className="burger-menu-item primary">
              Кастомная кнопка 2
            </button>
            <button className="burger-menu-item danger">
              Кастомная кнопка 3
            </button>
            <div className="burger-menu-section">
              <p className="burger-menu-text">
                Это пример кастомного содержимого, которое вы можете передать в бургер-меню через children.
              </p>
            </div>
          </div>
        </BurgerMenu>
      </div>

      <div className="space-y-4 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Для неавторизованных пользователей:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Кнопка "Войти в систему"</li>
            <li>• Кнопка "Зарегистрироваться"</li>
            <li>• Информация о приложении</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Для авторизованных пользователей:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Информация о профиле пользователя</li>
            <li>• Навигация (Профиль, Настройки)</li>
            <li>• Поддержка (Справка)</li>
            <li>• Кнопка "Выйти из системы"</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Особенности:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Абсолютное позиционирование поверх всего контента</li>
            <li>• Плавные анимации появления/исчезновения</li>
            <li>• Адаптивный дизайн для мобильных устройств</li>
            <li>• Переиспользуемый компонент с кастомным содержимым</li>
            <li>• Автоматическое закрытие при клике вне меню</li>
            <li>• <strong>Пустой базовый компонент</strong> - все содержимое передается через children</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 