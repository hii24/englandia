'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { BurgerMenuButton } from '@/components/ui/BurgerMenuButton';
import styles from './Header.module.scss';
import { BurgerMenuHome } from '@/components/BurgerMenuHome';
import { useBurgerMenu } from '@/hooks/useBurgerMenu';
import { useModal } from '@/hooks/useModal';

export default function Header() {
  const { isOpen, toggle } = useBurgerMenu();
  const { openLoginModal, openRegistrationModal } = useModal();

  const handleLoginClick = () => {
    openLoginModal();
  };

  const handleRegisterClick = () => {
    openRegistrationModal();
  };

  const handleMenuClick = () => {
    if (isOpen) {
      toggle();
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoBlock}>
          <Image src="/logo-full.svg" alt="EngLandia Logo" width={172} height={32} priority />
        </div>
        <div className={styles.navBlock}>
          <nav className={styles.menu}>
            <Link href="#about" className={styles.menuItem} onClick={handleMenuClick}>О школе</Link>
            <Link href="#lessons" className={styles.menuItem} onClick={handleMenuClick}>Занятия</Link>
            <Link href="#teachers" className={styles.menuItem} onClick={handleMenuClick}>Учителя</Link>
            <Link href="#reviews" className={styles.menuItem} onClick={handleMenuClick}>Отзывы</Link>
            <Link href="#pricing" className={styles.menuItem} onClick={handleMenuClick}>Цены</Link>
            <Link href="#contacts" className={styles.menuItem} onClick={handleMenuClick}>Контакты</Link>
          </nav>
          <div className={styles.buttons}>
            <Button variant="outline" className={styles.cabinetBtn} size="small" onClick={handleLoginClick}>
              <Image src="/cabinet-icon.svg" alt="Кабинет" width={23} height={28} />
              <span>Личный кабинет</span>
            </Button>
            <Button variant="primary" className={styles.freeLessonBtn} size="small" onClick={handleRegisterClick}>
              Бесплатное занятие
            </Button>
          </div>
          <div className={styles.burgerButton}>
            <BurgerMenuButton onClick={toggle} isOpen={isOpen} />
          </div>
        </div>
      </div>
      <BurgerMenuHome isOpen={isOpen} onToggle={toggle} />
    </header>
  );
} 