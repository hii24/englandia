import React from 'react';
import styles from './Footer.module.scss';
import Image from 'next/image';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.logoBlock}>
      <Image src="/logo-full.svg" alt="EngLandia Logo" width={172} height={32} />
    </div>
    <div className={styles.linksBlock}>
      <a href="#" className={styles.link}>Политика конфиденциальности</a>
      <a href="#" className={styles.link}>Пользовательское соглашение</a>
    </div>
    <div className={styles.socialBlock}>
      <a href="#" className={styles.socialIcon} aria-label="Facebook">
        <Image src="/facebook-icon.svg" alt="Facebook" width={24} height={24} />
      </a>
      <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
        <Image src="/linkedin-icon.svg" alt="LinkedIn" width={24} height={24} />
      </a>
      <a href="#" className={styles.socialIcon} aria-label="YouTube">
        <Image src="/youtube-icon.svg" alt="YouTube" width={24} height={24} />
      </a>
    </div>
    <div className={styles.copyright}>
      ©2025, EngLand
    </div>
  </footer>
);

export default Footer; 