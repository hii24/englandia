'use client';

import React from 'react';
import styles from './ResultsSection.module.scss';
import { Button } from '@/components/ui';
import { useModal } from '@/hooks/useModal';

const ResultsSection: React.FC = () => {
  const { openRegistrationModal } = useModal();

  const handleTryFree = () => {
    openRegistrationModal();
  };
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

  // Дублируем теги для бесконечной анимации - больше копий для плавности
  const duplicatedFirstRow = [...firstRowTags, ...firstRowTags, ...firstRowTags, ...firstRowTags, ...firstRowTags];
  const duplicatedSecondRow = [...secondRowTags, ...secondRowTags, ...secondRowTags, ...secondRowTags, ...secondRowTags];

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

        {/* Первая строка тегов - движется справа налево */}
        <div className={styles.firstRowWrapper}>
          <div className={styles.firstRowTags}>
            {duplicatedFirstRow.map((tag, index) => (
              <div
                key={index}
                className={`${styles.tag} ${(index % firstRowTags.length) === 3 ? styles.lastTag : ''}`}
              >
                <span className={styles.tagText}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Вторая строка тегов - движется слева направо */}
        <div className={styles.secondRowWrapper}>
          <div className={styles.secondRowTags}>
            {duplicatedSecondRow.map((tag, index) => (
              <div
                key={index}
                className={`${styles.tag} ${(index % secondRowTags.length) === 3 ? styles.lastTag : ''}`}
              >
                <span className={styles.tagText}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка */}
        <div className={styles.buttonContainer}>
          <Button className={styles.buttonBase} showIcon onClick={handleTryFree}>
            Попробовать бесплатно
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection; 