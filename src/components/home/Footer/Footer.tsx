import React from 'react';
import styles from './Footer.module.scss';
import Image from 'next/image';

interface FooterProps {
  id?: string;
}

const Footer: React.FC<FooterProps> = ({ id }) => (
  <footer className={styles.footer} id={id}>
    <div className={styles.logoBlock}>
      <Image src="/logo-full.svg" alt="EngLandia Logo" width={172} height={32} />
    </div>
    <div className={styles.linksBlock}>
      <a href="/privacy-policy" className={styles.link} target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a>
      <a href="/oferta" className={styles.link} target="_blank" rel="noopener noreferrer">Оферта</a>
    </div>
    <div className={styles.socialBlock}>
      <a href="https://www.facebook.com/share/1Fvg1tktnP/" className={styles.socialIcon} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
        <Image src="/facebook-icon.svg" alt="Facebook" width={24} height={24} />
      </a>
     
      <a href="https://www.instagram.com/englandia_school?igsh=MXF5eHpvNjFveG05bw==" className={styles.socialIcon} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
        <Image src="/instagram-icon.svg" alt="Instagram" width={24} height={24} />
      </a>
    </div>
    <div className={styles.copyright}>
      ©2025, EngLand
    </div>
  </footer>
);

export default Footer; 