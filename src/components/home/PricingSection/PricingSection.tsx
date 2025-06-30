import React from 'react';
import styles from './PricingSection.module.scss';
import { Button } from '@/components/ui';

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string;
  recommendation: string;
  features: string[];
  isFeatured?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'trial',
    title: 'Пробный',
    price: 'бесплатно',
    period: '1 занятие',
    description: 'Познакомимся, определим уровень, ребёнок попробует формат и получит красочный сертификат.',
    recommendation: 'Идеально для знакомства со школой',
    features: [
      '25 минут индивидуального урока',
      'Подходит для детей 4–12 лет',
      'Без обязательств'
    ]
  },
  {
    id: 'basic',
    title: 'Базовый',
    price: '$59',
    period: '4 занятия / мес',
    description: 'Поддержка регулярных занятий и закрепление материала',
    recommendation: 'Подходит для неспешного темпа и начального уровня',
    features: [
      'Индивидуальные уроки (1 раз в неделю)',
      'Домашние задания и рекомендации',
      'Доступ к обучающим играм'
    ],
    isFeatured: true
  },
  {
    id: 'intensive',
    title: 'Интенсив',
    price: '$99',
    period: '8 занятий / мес',
    description: 'Быстрый прогресс и уверенное владение языком',
    recommendation: 'Лучший выбор для максимального результата',
    features: [
      'Индивидуальные занятия (2 раза в неделю)',
      'Разговорный клуб в подарок',
      'Отслеживание прогресса и отчёты',
      'Поддержка в подготовке к Cambridge English'
    ]
  }
];

export default function PricingSection() {
  const renderCheckIcon = (isFeatured: boolean) => {
    return (
      <div className={styles.checkIcon}>
        <svg width="16.67" height="16.67" viewBox="0 0 17 17" fill="none">
          <path
            d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  const renderPricingCard = (plan: PricingPlan) => {
    const cardClasses = `${styles.pricingCard} ${plan.isFeatured ? styles.featured : ''}`;

    return (
      <div key={plan.id} className={cardClasses}>
        <div className={styles.cardHeader}>
          <h3 className={styles.planTitle}>{plan.title}</h3>
          <div className={styles.priceInfo}>
            <span className={styles.price}>{plan.price}</span>
            <span className={styles.period}>{plan.period}</span>
          </div>
        </div>

        <p className={styles.description}>{plan.description}</p>

        <div className={styles.separator}></div>

        <ul className={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <li key={index} className={styles.feature}>
              {renderCheckIcon(plan.isFeatured || false)}
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className={styles.separator}></div>

        <p className={styles.recommendation}>{plan.recommendation}</p>

        <div className={styles.ctaButton}>
          <Button showIcon>Записаться</Button>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Цены</h2>
        
        <div className={styles.pricingGrid}>
          {pricingPlans.map(renderPricingCard)}
        </div>
      </div>
    </section>
  );
} 