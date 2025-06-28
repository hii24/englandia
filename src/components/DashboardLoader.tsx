import React from 'react';
import './DashboardLoader.scss';

export const DashboardLoader: React.FC = () => {
  return (
    <div className="dashboard-loader">
      <div className="dashboard-loader__content">
        <div className="dashboard-loader__spinner"></div>
        <h2 className="dashboard-loader__title">Загрузка дашборда...</h2>
        <p className="dashboard-loader__subtitle">Подготавливаем ваши уроки</p>
      </div>
    </div>
  );
}; 