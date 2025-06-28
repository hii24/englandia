import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { TeacherStudentsTab } from '@/components/admin/TeacherStudentsTab';
import { TeacherLessonsTab } from '@/components/admin/TeacherLessonsTab';
import { AttendanceTab } from '@/components/admin/AttendanceTab';

interface TeacherPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TeacherTab = 'students' | 'lessons' | 'attendance';

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({ isOpen, onClose }) => {
  const user = useUserStore(s => s.user);
  const [activeTab, setActiveTab] = useState<TeacherTab>('students');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  if (!isOpen || user?.role !== 'teacher') return null;

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setActiveTab('lessons');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'students':
        return 'Выбор ученика';
      case 'lessons':
        return 'Управление уроками';
      case 'attendance':
        return 'Управление посещениями';
      default:
        return 'Панель учителя';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'students':
        return 'Выберите ученика для работы с его уроками';
      case 'lessons':
        return selectedStudent 
          ? `Работа с уроками ученика ${selectedStudent.firstName} ${selectedStudent.lastName}`
          : 'Сначала выберите ученика';
      case 'attendance':
        return selectedStudent 
          ? `Отметка посещений ученика ${selectedStudent.firstName} ${selectedStudent.lastName}`
          : 'Сначала выберите ученика';
      default:
        return '';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <TeacherStudentsTab 
            onStudentSelect={handleStudentSelect}
            selectedStudentId={selectedStudent?._id}
          />
        );
      case 'lessons':
        return <TeacherLessonsTab selectedStudent={selectedStudent} />;
      case 'attendance':
        return <AttendanceTab selectedStudent={selectedStudent} />;
      default:
        return <TeacherStudentsTab onStudentSelect={handleStudentSelect} />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--teacher">
        <button className="modal__close" onClick={onClose}>×</button>
        
        {/* Сайдбар */}
        <div className="teacher-sidebar">
          <h3>Панель учителя</h3>
          <nav className="teacher-nav">
            <button
              className={`teacher-nav__item ${activeTab === 'students' ? 'teacher-nav__item--active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              👥 Мои ученики
            </button>
            <button
              className={`teacher-nav__item ${activeTab === 'lessons' ? 'teacher-nav__item--active' : ''}`}
              onClick={() => setActiveTab('lessons')}
              disabled={!selectedStudent}
            >
              📚 Уроки ученика
            </button>
            <button
              className={`teacher-nav__item ${activeTab === 'attendance' ? 'teacher-nav__item--active' : ''}`}
              onClick={() => setActiveTab('attendance')}
              disabled={!selectedStudent}
            >
              ✅ Посещения
            </button>
          </nav>
          
          {selectedStudent && (
            <div className="selected-student">
              <h4>Выбранный ученик:</h4>
              <div className="selected-student-info">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </div>
            </div>
          )}
        </div>

        {/* Основной контент */}
        <div className="teacher-content">
          <div className="teacher-content__header">
            <h2>{getTabTitle()}</h2>
            <p>{getTabDescription()}</p>
          </div>
          
          <div className="teacher-content__body">
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
          width: 95vw;
          height: 95vh;
          max-width: 95vw;
          max-height: 95vh;
        }
        .modal--teacher {
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
          color: #64748b;
          transition: color 0.2s;
        }
        .modal__close:hover {
          color: #1e293b;
        }
        .teacher-sidebar {
          width: 320px;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          padding: 24px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .teacher-sidebar h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .teacher-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        .teacher-nav__item {
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
        .teacher-nav__item:hover:not(:disabled) {
          background: #e2e8f0;
          color: #475569;
        }
        .teacher-nav__item--active {
          background: #7c3aed;
          color: white;
        }
        .teacher-nav__item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .selected-student {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .selected-student h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }
        .selected-student-info {
          padding: 8px 12px;
          background: #ede9fe;
          border-radius: 8px;
          font-size: 14px;
          color: #7c3aed;
          font-weight: 500;
        }
        .teacher-content {
          flex: 1;
          padding: 32px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .teacher-content__header {
          margin-bottom: 24px;
        }
        .teacher-content__header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }
        .teacher-content__header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .teacher-content__body {
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}; 