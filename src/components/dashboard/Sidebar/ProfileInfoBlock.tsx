import React from 'react';
import Image from 'next/image';

export const ProfileInfoBlock = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const age = user?.age ? `${user.age} лет` : '—';
  const packageName = user?.subscription || '—';
  const email = user?.email || '—';
  return (
    <div className="profile-info-block">
      <div className="profile-info-block__avatar">
        <Image src={user?.avatar || '/default-avatar.png'} alt="Аватар" width={50} height={50} />
      </div>
      <div className="profile-info-block__name">{user?.firstName || 'Имя'}</div>
      {(user?.role === 'student' || user?.role === 'guest') && (
        <>
          <div className="profile-info-block__label">Возраст ребёнка</div>
          <div className="profile-info-block__value profile-info-block__value--bold">{age}</div>
          <div className="profile-info-block__label">Пакет</div>
          <div className="profile-info-block__value profile-info-block__value--bold">{packageName}</div>
        </>
      )}
      <div className="profile-info-block__label">Email</div>
      <div className="profile-info-block__value profile-info-block__value--bold">{email}</div>
      <button className="dashboard-sidebar__logout" onClick={onLogout}>
          <Image src="/exit.svg" alt="exit" width={50} height={50} />
          <span>Выйти</span>
        </button>
    </div>
  );
}; 