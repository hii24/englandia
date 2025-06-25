import React from 'react';
import { BurgerMenu } from './ui/BurgerMenu';
import { useUserStore } from '@/store/userStore';
import { useModalStore } from '@/store/modalStore';
import RegistrationModal from '@/modals/RegistrationModal';
import { sendRegistration } from '@/lib/api';
import { LoginModal } from '@/modals';
import { useModal } from '@/hooks/useModal';

interface BurgerMenuDashboardProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const BurgerMenuDashboard: React.FC<BurgerMenuDashboardProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const { user, logout, isAuthenticated } = useUserStore();
  const { openLoginModal, openRegistrationModal } = useModal();

  const handleLogout = () => {
    logout();
    onToggle();
  };

  const handleRegisterClick = () => {
    onToggle();
    // В бургер-меню:
    openRegistrationModal();
  };
  const handleLoginClick = () => {
    onToggle();
    openLoginModal();
  };

  const handleProfileClick = () => {
    // TODO: Добавить навигацию к профилю
    onToggle();
  };

  const handleSettingsClick = () => {
    // TODO: Добавить навигацию к настройкам
    onToggle();
  };

  const handleHelpClick = () => {
    // TODO: Добавить навигацию к справке
    onToggle();
  };

  return (
    <BurgerMenu isOpen={isOpen} onToggle={onToggle}>
      {isAuthenticated ? (
        <div className="burger-menu-authenticated">
          {user && (
            <div className="burger-menu-section">
              <h4 className="burger-menu-section-title">Профиль</h4>
              <div className="burger-menu-user-info">
                <p className="burger-menu-text">
                  <strong>{user.firstName} {user.lastName}</strong>
                </p>
                <p className="burger-menu-text">
                  {user.email}
                </p>
                <p className="burger-menu-text">
                  Роль: {user.role}
                </p>
              </div>
            </div>
          )}
          <div className="burger-menu-section">
            <h4 className="burger-menu-section-title">Навигация</h4>
            <button 
              className="burger-menu-item"
              onClick={handleProfileClick}
            >
              Мой профиль
            </button>
            <button 
              className="burger-menu-item"
              onClick={handleSettingsClick}
            >
              Настройки
            </button>
          </div>
          <div className="burger-menu-section">
            <h4 className="burger-menu-section-title">Поддержка</h4>
            <button 
              className="burger-menu-item"
              onClick={handleHelpClick}
            >
              Справка
            </button>
          </div>
          <div className="burger-menu-section">
            <button 
              className="burger-menu-item danger"
              onClick={handleLogout}
            >
              Выйти из системы
            </button>
          </div>
        </div>
      ) : (
        <div className="burger-menu-unauthenticated">
          <button 
            className="burger-menu-item primary"
            onClick={handleRegisterClick}
          >
            Зарегистрироваться
          </button>
          <br/>
          <button 
            className="burger-menu-item primary"
            onClick={handleLoginClick}
          >
            Логін
          </button>
        </div>
      )}
    </BurgerMenu>
  );
}; 