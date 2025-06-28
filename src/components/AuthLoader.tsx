import React from 'react';
import './AuthLoader.scss';

export const AuthLoader: React.FC = () => {
  return (
    <div className="auth-loader">
      <div className="auth-loader__content">
        <div className="auth-loader__spinner"></div>
        <h2 className="auth-loader__title">Проверка авторизации...</h2>
        <p className="auth-loader__subtitle">Проверяем ваши данные</p>
      </div>
    </div>
  );
}; 