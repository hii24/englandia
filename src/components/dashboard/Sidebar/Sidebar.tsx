import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import './Sidebar.scss';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import { SettingsModal } from '@/modals/SettingsModal';
import { AdminPanelModal } from '@/modals/AdminPanelModal';
import { TeacherPanelModal } from '@/modals/TeacherPanelModal';
import { SubscriptionManageModal } from '@/modals/SubscriptionManageModal';
import { Button } from '@/components/ui';

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
  const [packageName, setPackageName] = useState('—');
  const [loading, setLoading] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

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
          setSubscriptionInfo(data.subscription || null);
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

  // Функция отмены подписки
  const handleCancelSubscription = async () => {
    if (!user?._id) return;
    await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id })
    });
    setSubscriptionModalOpen(false);
    window.location.reload();
  };

  // Функция оплаты подписки
  const handlePaySubscription = async (type: 'basic' | 'intensive') => {
    // Проверка: если есть активная или отменённая, но ещё действующая подписка
    if (subscriptionInfo && (
      subscriptionInfo.status === 'active' || subscriptionInfo.cancelAtPeriodEnd
    )) {
      let endDate = '';
      if (subscriptionInfo.endDate) {
        const d = new Date(subscriptionInfo.endDate);
        endDate = d.toLocaleDateString();
      }
      alert(
        `У вас уже есть активная подписка. Оформить новую можно после окончания текущей${endDate ? ' (' + endDate + ')' : ''}.`
      );
      return;
    }
    if (!user?._id) return;
    const res = await fetch('/api/subscription/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, subscriptionType: type.toUpperCase() })
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
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
              <span className="dashboard-sidebar__info-value">
                {loading ? 'Загрузка...' : packageName}
              </span>
            </div>
          </>
        )}
        <div className="dashboard-sidebar__info-block">
          <span className="dashboard-sidebar__info-label">Email</span>
          <span className="dashboard-sidebar__info-value">{email}</span>
        </div>
        <Button
          className={
            subscriptionInfo && subscriptionInfo.status === 'active'
              ? 'btn-primary mb-3'
              : 'btn-primary btn-large mb-3'
          }
          style={{ width: '100%', fontSize: 18, padding: '16px 0', marginTop: 16 }}
          onClick={() => setSubscriptionModalOpen(true)}
        >
          {subscriptionInfo && subscriptionInfo.status === 'active'
            ? 'Управление подпиской'
            : 'Оформить подписку'}
        </Button>
        <button className="dashboard-sidebar__logout" onClick={logout}>
          <Image src="/exit.svg" alt="exit" width={50} height={50} />
          <span>Выйти</span>
        </button>
      </div>
      
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AdminPanelModal isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
      <TeacherPanelModal isOpen={teacherPanelOpen} onClose={() => setTeacherPanelOpen(false)} />
      <SubscriptionManageModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        subscription={subscriptionInfo}
        loading={loading}
        onCancel={handleCancelSubscription}
        onPay={handlePaySubscription}
      />
    </aside>
  );
}; 