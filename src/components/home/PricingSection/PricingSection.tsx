'use client';

import React, { useState } from 'react';
import styles from './PricingSection.module.scss';
import { Button } from '@/components/ui';
import { useModal } from '@/hooks/useModal';

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string;
  recommendation: string;
  features: string[];
  isFeatured?: boolean;
  oldPrice?: string;
  discountLabel?: string; // текст бейджа скидки
}

const initialPlans: PricingPlan[] = [
  {
    id: 'month1',
    title: '1 месяц',
    price: '100 USD',
    period: '8 уроков /месяц',
    description: 'Скидка $20 — 120 USD → 100 USD',
    oldPrice: '120 USD',
    discountLabel: 'скидка — $20',
    recommendation: 'Международный стандарт обучения CEFR',
    features: [
      'Индивидуальные онлайн-занятия',
      '24/7 доступ к обучающим материалам и играм',
      'Игровая форма обучения',
      'Обратная связь от учителя',
    ]
  },
  {
    id: 'month3',
    title: '3 месяца',
    price: '280 USD',
    period: '24 урока / 3 месяца',
    description: 'Скидка $80 — 360 USD → 280 USD',
    oldPrice: '360 USD',
    discountLabel: 'скидка — $80',
    recommendation: 'Международный стандарт обучения CEFR',
    features: [
      'Индивидуальные онлайн-занятия',
      '24/7 доступ к обучающим материалам и играм',
      'Игровая форма обучения',
      'Обратная связь от учителя',
    
    ],
    isFeatured: true
  },
  {
    id: 'month6',
    title: '6 месяцев',
    price: '530 USD',
    period: '48 уроков / 6 месяцев',
    description: 'Скидка $190 — 720 USD → 530 USD',
    oldPrice: '720 USD',
    discountLabel: 'скидка — $190',
    recommendation: 'Международный стандарт обучения CEFR',
    features: [
      'Индивидуальные онлайн-занятия',
      '24/7 доступ к обучающим материалам и играм',
      'Игровая форма обучения',
      'Обратная связь от учителя',
    ]
  }
];

interface PricingSectionProps {
  id?: string;
}

// Статические цены на лендинге по требованию — без динамической загрузки

export default function PricingSection({ id }: PricingSectionProps) {
  const { openRegistrationModal } = useModal();
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);
  

  const handleSignUp = () => {
    openRegistrationModal();
  };
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
          {plan.discountLabel && (
            <div className={styles.discountBadge}>{plan.discountLabel}</div>
          )}
          <div className={styles.priceBlock}>
            <div className={styles.periodText}>{plan.period}</div>
            <div className={styles.pillPrice}>
              {plan.oldPrice && (
                <div className={styles.oldPrice}>{plan.oldPrice}</div>
              )}
              <div className={styles.newPrice}>{plan.price}</div>
            </div>
          </div>
        </div>

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
          <Button showIcon onClick={handleSignUp}>Записаться</Button>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.pricingSection} id={id}>
      <div className={styles.container}>
        <h2 className={styles.title}>Цены</h2>
        
        <div className={styles.pricingGrid}>
          {plans.map(renderPricingCard)}
        </div>
      </div>
    </section>
  );
} 