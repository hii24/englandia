import React from 'react';
import './RedirectLoader.scss';

export const RedirectLoader: React.FC = () => {
  return (
    <div className="redirect-loader">
      <div className="redirect-loader__content">
        <div className="redirect-loader__spinner"></div>
        <h2 className="redirect-loader__title">Перенаправление...</h2>
        <p className="redirect-loader__subtitle">Переходим на главную страницу</p>
      </div>
    </div>
  );
}; 