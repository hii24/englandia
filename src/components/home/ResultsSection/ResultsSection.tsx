import React from 'react';
import styles from './ResultsSection.module.scss';

const ResultsSection: React.FC = () => {
  const firstRowTags = [
    'Улучшить английский для школы',
    'Преодолеть языковой барьер', 
    'Говорить на английском в поездках',
    'Подготовиться к международным экзаменам'
  ];

  const secondRowTags = [
    'общаться с детьми из других стран',
    'Понимать книги, фильмы и мультфильмы',
    'Учиться за границей',
    'Участвовать в олимпиадах по английскому'
  ];

  return (
    <section className={styles.resultsSection}>
      <div className={styles.container}>
        {/* Заголовок */}
        <h2 className={styles.title}>
          Видимые результаты
        </h2>
        
        {/* Подзаголовок */}
        <p className={styles.subtitle}>
          уже через месяц занятий
        </p>

        {/* Первая строка тегов */}
        <div className={styles.firstRowTags}>
          {firstRowTags.map((tag, index) => (
            <div
              key={index}
              className={`${styles.tag} ${index === 3 ? styles.lastTag : ''}`}
            >
              <span className={styles.tagText}>
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Вторая строка тегов */}
        <div className={styles.secondRowTags}>
          {secondRowTags.map((tag, index) => (
            <div
              key={index}
              className={`${styles.tag} ${index === 3 ? styles.lastTag : ''}`}
            >
              <span className={styles.tagText}>
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Кнопка */}
        <div className={styles.buttonContainer}>
          <button className={styles.buttonBase}>
            <span className={styles.buttonText}>
              Попробовать бесплатно
            </span>
          </button>
          <div className={styles.buttonCircle}>
            <svg width="19" height="16" viewBox="0 0 19 16" fill="none">
              <path d="M1 8H18M18 8L11 1M18 8L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection; 