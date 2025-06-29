import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export const ProfileInfoBlock = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [packageName, setPackageName] = useState('—');
  const [loading, setLoading] = useState(false);

  const age = user?.age ? `${user.age} лет` : '—';
  const email = user?.email || '—';

  // Загружаем информацию о подписке
  useEffect(() => {
    if (user?._id) {
      setLoading(true);
      fetch(`/api/users/subscription?userId=${user._id}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        })
        .then(data => {
          console.log('✅ Subscription info loaded:', data);
          setPackageName(data.packageName || '—');
        })
        .catch(error => {
          console.error('❌ Error loading subscription info:', error);
          // В случае ошибки показываем базовую информацию
          if (user?.role === 'guest') {
            setPackageName('Гостевой доступ');
          } else {
            setPackageName('—');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?._id, user?.role]);

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
          <div className="profile-info-block__value profile-info-block__value--bold">
            {loading ? 'Загрузка...' : packageName}
          </div>
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