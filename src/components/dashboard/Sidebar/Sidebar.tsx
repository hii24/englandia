import React from 'react';
import { useUserStore } from '@/store/userStore';
import './Sidebar.scss';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';

export const Sidebar: React.FC = () => {
  const { user, logout } = useUserStore();

  const age = user?.age ? `${user.age} лет` : '—';
  const packageName = user?.subscription || '—';
  const email = user?.email || '—';

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__logo">
        <Image src="/logo.png" alt="logo" width={172} height={32} />
      </div>
      <div className="dashboard-sidebar__profile">
        <Image
          src={'/avatar.png'}
          alt="Аватар"
          width={50}
          height={50}
          className="dashboard-sidebar__avatar"
        />
        <span className="dashboard-sidebar__name">{user?.firstName || 'Имя'}</span>
      </div>
      <div className="dashboard-sidebar__search">
        <SearchInput placeholder="Поиск" />
      </div>
      <div className="dashboard-sidebar__info">
        <div className="dashboard-sidebar__info-block">
          <span className="dashboard-sidebar__info-label">Возраст ребёнка</span>
          <span className="dashboard-sidebar__info-value">{age}</span>
        </div>
        <div className="dashboard-sidebar__info-block">
          <span className="dashboard-sidebar__info-label">Пакет</span>
          <span className="dashboard-sidebar__info-value">{packageName}</span>
        </div>
        <div className="dashboard-sidebar__info-block">
          <span className="dashboard-sidebar__info-label">Email</span>
          <span className="dashboard-sidebar__info-value">{email}</span>
        </div>
        <button className="dashboard-sidebar__logout" onClick={logout}>
          <Image src="/exit.svg" alt="exit" width={50} height={50} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}; 