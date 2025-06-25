import React from 'react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import { useUserStore } from '@/store/userStore';
import { BurgerMenuButton } from '@/components/ui';
import './Header.scss';
import { BurgerMenuDashboard } from '@/components/BurgerMenuDashboard';
import { useBurgerMenu } from '@/hooks/useBurgerMenu';

export const Header: React.FC = () => {
  const { user } = useUserStore();
  const { isOpen, toggle } = useBurgerMenu();
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__top">
        <Image src="/logo.png" alt="logo" width={172} height={32} />
        <div>
          <div className="dashboard-header__top-right">
            <Image
              src={"/avatar.png"}
              alt="Аватар"
              width={50}
              height={50}
              className="dashboard-header__avatar"
            />
            <BurgerMenuDashboard isOpen={isOpen} onToggle={toggle} />
          </div>
        </div>
      </div>
      <div className="dashboard-header__bottom">
        <SearchInput placeholder="Поиск" />
      </div>
    </header>
  );
}; 