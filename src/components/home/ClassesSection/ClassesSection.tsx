'use client';

import { useState } from 'react';
import styles from './ClassesSection.module.scss';

interface ClassItem {
  emoji: string;
  title: string;
  description: string;
  weight: 'normal' | 'bold';
}

interface ClassesSectionProps {
  id?: string;
}

export default function ClassesSection({ id }: ClassesSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const classesData: ClassItem[] = [
    {
      emoji: '👨‍🏫',
      title: 'Индивидуальные занятия с учителем',
      description: 'Преподаватель замечает даже самые маленькие успехи, мягко корректирует ошибки и помогает ребёнку уверенно двигаться вперёд — в своём ритме и без давления.',
      weight: 'normal'
    },
    {
      emoji: '🌐',
      title: 'Учёба из любой точки мира',
      description: 'Онлайн-формат — удобно и безопасно.\nВсё, что нужно — интернет и ноутбук.',
      weight: 'normal'
    },
    {
      emoji: '🕒',
      title: 'Уроки по 25 или 50 минут',
      description: 'Гибкая продолжительность — короткие для малышей, полноценные для тех, кто постарше.',
      weight: 'normal'
    },
    {
      emoji: '📚',
      title: 'Программа адаптирована под возраст',
      description: 'Мы подбираем задания и подход к обучению с учётом возраста, уровня и интересов ребёнка',
      weight: 'bold'
    },
    {
      emoji: '💬',
      title: 'Разговорная практика на каждом уроке',
      description: 'С первых занятий ребёнок начинает говорить — даже если раньше стеснялся или вообще не знал английский. Мы уделяем внимание живому общению',
      weight: 'bold'
    },
    {
      emoji: '🎉',
      title: 'Песни, игры и весёлые задания',
      description: 'Обучение проходит легко и с интересом. Ребёнок даже не замечает, что учится',
      weight: 'bold'
    },
    {
      emoji: '🧙‍♂️',
      title: 'Мультфильмы и истории',
      description: 'Увлекательные сюжеты помогают погрузиться в языковую среду без скучных правил',
      weight: 'bold'
    },
    {
      emoji: '🎓',
      title: 'Подготовка к Cambridge English',
      description: 'Готовим к международным экзаменам. Даём реальные цели и работаем на результат',
      weight: 'bold'
    },
    {
      emoji: '📈',
      title: 'Отслеживание прогресса',
      description: 'Мы даём родителям чёткую картину прогресса ребёнка, а не просто «всё хорошо».\nТакая обратная связь помогает понимать, как развивается ребёнок, его интересы и как дальше выстраивать процесс обучения.',
      weight: 'bold'
    }
  ];

  // Распределяем карточки по 3 колонкам
  const distributeCards = (): ClassItem[][] => {
    const columns: ClassItem[][] = [[], [], []];
    classesData.forEach((card, index) => {
      columns[index % 3].push(card);
    });
    return columns;
  };

  const columns = distributeCards();
  const visibleCards = showAll ? 9 : 6;

  const renderCard = (item: ClassItem, index: string | number) => (
    <div key={index} className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <div className={styles.iconCircle}>
            <span className={styles.emoji}>{item.emoji}</span>
          </div>
        </div>
        <h3 className={`${styles.cardTitle} ${item.weight === 'bold' ? styles.cardTitleBold : ''}`}>
          {item.title}
        </h3>
      </div>
      <p className={styles.cardDescription}>
        {item.description}
      </p>
    </div>
  );

  return (
    <section className={styles.classes} id={id}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наши занятия</h2>
        
        {/* Десктопная версия - 3 колонки */}
        <div className={styles.cardGrid}>
          {columns.map((column, colIndex) => (
            <div key={colIndex} className={styles.column}>
              {column.map((item, cardIndex) => renderCard(item, `${colIndex}-${cardIndex}`))}
            </div>
          ))}
        </div>

        {/* Мобильная версия - список */}
        <div className={styles.cardList}>
          {classesData.slice(0, visibleCards).map((item, index) => renderCard(item, index))}
          
          {!showAll && (
            <button 
              className={styles.showMoreBtn}
              onClick={() => setShowAll(true)}
            >
              Показать еще
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.54483 0.952879C7.55472 1.01378 7.55928 1.07541 7.55848 1.13707L7.55848 11.637L7.66497 11.408C7.77089 11.1842 7.91505 10.9806 8.09093 10.8064L11.0354 7.86192C11.4055 7.47413 12.0011 7.40897 12.4463 7.70751C12.9209 8.05496 13.0239 8.72129 12.6764 9.19583C12.6483 9.23417 12.6177 9.27061 12.5848 9.30485L7.26031 14.6293C6.84467 15.0454 6.17042 15.0458 5.75431 14.6302C5.75405 14.6299 5.75375 14.6296 5.75348 14.6293L0.429005 9.30485C0.0137292 8.88841 0.01466 8.21417 0.431101 7.79886C0.46388 7.76618 0.498755 7.73566 0.535494 7.70751C0.980786 7.40897 1.5763 7.47413 1.94648 7.86192L4.89624 10.801C5.05265 10.9573 5.1838 11.1369 5.28493 11.3335L5.42869 11.6529L5.42869 1.19567C5.40849 0.651679 5.78849 0.174406 6.3232 0.0722093C6.90373 -0.0219336 7.45066 0.372344 7.54483 0.952879Z" fill="#440693"/>
</svg>

            </button>
          )}
        </div>
      </div>
    </section>
  );
} 