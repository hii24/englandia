import React from 'react';
import styles from './Footer.module.scss';
import Image from 'next/image';

interface FooterProps {
  id?: string;
}

const Footer: React.FC<FooterProps> = ({ id }) => (
  <footer className={styles.footer} id={id}>
    <div className={styles.logoBlock}>
      <Image src="/logo-full1.svg" alt="EngLandia Logo" width={172} height={32} />
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
    <div className={styles.contactBlock}>
      <a href="tel:+14037037323" className={styles.contactRow}>
        <span className={styles.contactIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 2.5A2 2 0 0 1 5.5 0.5h7A2 2 0 0 1 14.5 2.5v13a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-13Z" stroke="#808080" strokeWidth="1.5"/>
            <path d="M6.5 1.5h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" fill="#fff"/>
            <path d="M9 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" fill="#808080"/>
          </svg>
        </span>
        +1 (403) 703 7323
      </a>
      <a href="mailto:englandiame@gmail.com" className={styles.contactRow}>
        <span className={styles.contactIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 4.5h13.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 .75-.75Zm0 0 6.75 4.5L16.5 4.5" stroke="#808080" strokeWidth="1.5"/>
          </svg>
        </span>
        englandiame@gmail.com
      </a>
      <div className={styles.contactRow}>
        <span className={styles.contactIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2C5.13 2 2 5.13 2 9c0 4.25 6.1 6.65 6.37 6.75.14.05.29.05.43 0C9.9 15.65 16 13.25 16 9c0-3.87-3.13-7-7-7Zm0 12.13C7.14 13.13 3 11.1 3 9c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.1-4.14 4.13-6 5.13Zm0-7.13a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#808080"/>
          </svg>
        </span>
        Canada, Calgary, AB<br/>Postal Code: T2Y 4L7
      </div>
    </div>
    <div className={styles.copyright}>
      ©2025, EngLandia
    </div>
  </footer>
);

export default Footer; 