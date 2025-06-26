import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import './Sidebar.scss';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import { SettingsModal } from '@/modals/SettingsModal';
import { AdminPanelModal } from '@/modals/AdminPanelModal';
import { TeacherPanelModal } from '@/modals/TeacherPanelModal';

// Моковые ученики для примера
const mockStudents = [
  { _id: 'stu1', firstName: 'Иван', lastName: 'Иванов' },
  { _id: 'stu2', firstName: 'Мария', lastName: 'Петрова' },
  { _id: 'stu3', firstName: 'Анна', lastName: 'Сидорова' },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useUserStore();
  const selectedStudentId = useUserStore(s => s.selectedStudentId);
  const setSelectedStudent = useUserStore(s => s.setSelectedStudent);
  const [students, setStudents] = useState<any[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [teacherPanelOpen, setTeacherPanelOpen] = useState(false);

  const age = user?.age ? `${user.age} лет` : '—';
  const packageName = user?.subscription || '—';
  const email = user?.email || '—';

  useEffect(() => {
    if (user?.role === 'teacher' && user?._id) {
      fetch(`/api/users?role=student&teacherId=${user._id}`)
        .then(res => res.json())
        .then(setStudents);
    }
  }, [user]);

  const handleSettingsClick = () => {
    if (user?.role === 'admin') {
      setAdminPanelOpen(true);
    } else if (user?.role === 'teacher') {
      setTeacherPanelOpen(true);
    } else {
      setSettingsOpen(true);
    }
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__logo">
        <Image src="/logo.png" alt="logo" width={172} height={32} />
      </div>
      <div className="dashboard-sidebar__profile">
        <Image
          src="/default-avatar.png"
          alt="Аватар"
          width={50}
          height={50}
          className="dashboard-sidebar__avatar"
        />
        <span className="dashboard-sidebar__name">{user?.firstName || 'Имя'}</span>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button
            className="dashboard-sidebar__settings-btn"
            onClick={handleSettingsClick}
            title={
              user?.role === 'admin' ? 'Админ-панель' : 
              user?.role === 'teacher' ? 'Панель учителя' : 
              'Настройки'
            }
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}
          >
            {user?.role === 'admin' ? '⚙️' : user?.role === 'teacher' ? '📚' : '⚙️'}
          </button>
        )}
      </div>
      <div className="dashboard-sidebar__search">
        <SearchInput placeholder="Поиск" />
      </div>
      <div className="dashboard-sidebar__info">
        {(user?.role === 'student' || user?.role === 'guest') && (
          <>
            <div className="dashboard-sidebar__info-block">
              <span className="dashboard-sidebar__info-label">Возраст ребёнка</span>
              <span className="dashboard-sidebar__info-value">{age}</span>
            </div>
            <div className="dashboard-sidebar__info-block">
              <span className="dashboard-sidebar__info-label">Пакет</span>
              <span className="dashboard-sidebar__info-value">{packageName}</span>
            </div>
          </>
        )}
        <div className="dashboard-sidebar__info-block">
          <span className="dashboard-sidebar__info-label">Email</span>
          <span className="dashboard-sidebar__info-value">{email}</span>
        </div>
        <button className="dashboard-sidebar__logout" onClick={logout}>
          <Image src="/exit.svg" alt="exit" width={50} height={50} />
          <span>Выйти</span>
        </button>
      </div>
      
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AdminPanelModal isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
      <TeacherPanelModal isOpen={teacherPanelOpen} onClose={() => setTeacherPanelOpen(false)} />
    </aside>
  );
}; 