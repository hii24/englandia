import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui';
import { useModal } from '@/hooks/useModal';
import styles from './BurgerMenuHome.module.scss';

interface BurgerMenuHomeProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const BurgerMenuHome: React.FC<BurgerMenuHomeProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const { openLoginModal, openRegistrationModal } = useModal();

  const handleLoginClick = () => {
    onToggle();
    openLoginModal();
  };

  const handleRegisterClick = () => {
    onToggle();
    openRegistrationModal();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onToggle}>
      <div className={styles.menuWrapper} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onToggle}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M1 17L17 1" stroke="#440693" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Logo */}
        <div className={styles.logoBlock}>
          <Image src="/logo-full.svg" alt="EngLandia Logo" width={172} height={32} priority />
        </div>

        {/* Menu */}
        <nav className={styles.menu}>
          <Link href="#about" className={styles.menuItem} onClick={onToggle}>
            О школе
          </Link>
          <Link href="#lessons" className={styles.menuItem} onClick={onToggle}>
            Занятия
          </Link>
          <Link href="#teachers" className={styles.menuItem} onClick={onToggle}>
            Учителя
          </Link>
          <Link href="#reviews" className={styles.menuItem} onClick={onToggle}>
            Отзывы
          </Link>
          <Link href="#pricing" className={styles.menuItem} onClick={onToggle}>
            Цены
          </Link>
          <Link href="#contacts" className={styles.menuItem} onClick={onToggle}>
            Контакты
          </Link>
        </nav>

        {/* Buttons */}
        <div className={styles.buttons}>
          <Button variant="outline" className={styles.cabinetBtn} size="small" onClick={handleLoginClick}>
            <Image src="/cabinet-icon.svg" alt="Кабинет" width={23} height={28} />
            <span>Личный кабинет</span>
          </Button>
          <Button className={styles.freeLessonBtn} size="small" onClick={handleRegisterClick}>
            Бесплатное занятие
          </Button>
        </div>

        {/* Social */}
        <div className={styles.socials}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Image src="/facebook-icon.svg" alt="Facebook" width={40} height={40} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src="/linkedin-icon.svg" alt="LinkedIn" width={40} height={40} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <Image src="/youtube-icon.svg" alt="YouTube" width={40} height={40} />
          </a>
        </div>
      </div>
    </div>
  );
}; 