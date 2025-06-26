import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { AssignTeachersTab } from '@/components/admin/AssignTeachersTab';
import { CreateLessonTab } from '@/components/admin/CreateLessonTab';
import { EditLessonsTab } from '@/components/admin/EditLessonsTab';
import { ScheduleTab } from '@/components/admin/ScheduleTab';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'assign' | 'create' | 'edit' | 'schedule';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const user = useUserStore(s => s.user);
  const [activeTab, setActiveTab] = useState<AdminTab>('assign');

  if (!isOpen || user?.role !== 'admin') return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'assign':
        return <AssignTeachersTab />;
      case 'create':
        return <CreateLessonTab />;
      case 'edit':
        return <EditLessonsTab />;
      case 'schedule':
        return <ScheduleTab />;
      default:
        return <AssignTeachersTab />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'assign':
        return 'Назначение учителей ученикам';
      case 'create':
        return 'Создание нового урока';
      case 'edit':
        return 'Редактирование уроков';
      case 'schedule':
        return 'Управление расписанием';
      default:
        return 'Админ-панель';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'assign':
        return 'Выберите учителя для каждого ученика из списка ниже';
      case 'create':
        return 'Заполните форму для создания нового урока';
      case 'edit':
        return 'Выберите урок для редактирования из списка';
      case 'schedule':
        return 'Настройте расписание уроков для автоматического планирования';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--admin">
        <button className="modal__close" onClick={onClose}>×</button>
        
        {/* Сайдбар */}
        <div className="admin-sidebar">
          <h3>Админ-панель</h3>
          <nav className="admin-nav">
            <button
              className={`admin-nav__item ${activeTab === 'assign' ? 'admin-nav__item--active' : ''}`}
              onClick={() => setActiveTab('assign')}
            >
              👥 Назначить учителей
            </button>
            <button
              className={`admin-nav__item ${activeTab === 'create' ? 'admin-nav__item--active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              ➕ Создать урок
            </button>
            <button
              className={`admin-nav__item ${activeTab === 'edit' ? 'admin-nav__item--active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              ✏️ Редактировать уроки
            </button>
            <button
              className={`admin-nav__item ${activeTab === 'schedule' ? 'admin-nav__item--active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              📅 Расписание уроков
            </button>
          </nav>
        </div>

        {/* Основной контент */}
        <div className="admin-content">
          <div className="admin-content__header">
            <h2>{getTabTitle()}</h2>
            <p>{getTabDescription()}</p>
          </div>
          
          <div className="admin-content__body">
            {renderContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay { 
          position: fixed; 
          left: 0; 
          top: 0; 
          width: 100vw; 
          height: 100vh; 
          background: rgba(0,0,0,0.25); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000; 
        }
        .modal { 
          background: #fff; 
          border-radius: 16px; 
          box-shadow: 0 4px 32px rgba(0,0,0,0.12); 
          position: relative; 
          display: flex;
          min-width: 800px;
          max-width: 90vw;
          height: 600px;
          max-height: 90vh;
        }
        .modal--admin {
          overflow: hidden;
        }
        .modal__close { 
          position: absolute; 
          right: 16px; 
          top: 16px; 
          background: none; 
          border: none; 
          font-size: 28px; 
          cursor: pointer;
          z-index: 10;
        }
        .admin-sidebar {
          width: 280px;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .admin-nav__item {
          background: none;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
        }
        .admin-nav__item:hover {
          background: #e2e8f0;
          color: #475569;
        }
        .admin-nav__item--active {
          background: #7c3aed;
          color: white;
        }
        .admin-content {
          flex: 1;
          padding: 32px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-content__header {
          margin-bottom: 24px;
        }
        .admin-content__header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }
        .admin-content__header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .admin-content__body {
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}; 