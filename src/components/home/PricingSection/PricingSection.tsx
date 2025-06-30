import React from 'react';
import { Button } from '@/components/ui';
import styles from './PricingSection.module.scss';

const PricingSection: React.FC = () => {
  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        {/* Заголовок секции */}
        <h2 className={styles.title}>Цены</h2>
        
        {/* Карточки тарифов */}
        <div className={styles.pricingCards}>
          {/* Карточка 1: Пробный */}
          <div className={styles.pricingCard}>
            <div className={styles.cardBackground}></div>
            
            {/* Заголовок и цена */}
            <div className={styles.cardTitle}>
              <h3 className={styles.planName}>Пробный</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>бесплатно</span>
                <span className={styles.period}>1 занятие</span>
              </div>
            </div>
            
            {/* Описание */}
            <p className={styles.description}>
              Познакомимся, определим уровень, ребёнок попробует формат и получит красочный сертификат.
            </p>
            
            {/* Первый разделитель */}
            <div className={styles.divider}></div>
            
            {/* Список преимуществ */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>25 минут индивидуального урока</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Подходит для детей 4–12 лет</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Без обязательств</span>
              </div>
            </div>
            
            {/* Второй разделитель */}
            <div className={styles.divider}></div>
            
            {/* Подзаголовок */}
            <p className={styles.subtitle}>Идеально для знакомства со школой</p>
            
            {/* Кнопка */}
            <div className={styles.buttonContainer}>
              <Button 
                variant="primary" 
                size="large"
                className={styles.enrollButton}
              >
                Записаться
              </Button>
            </div>
          </div>
          
          {/* Карточка 2: Базовый (популярная) */}
          <div className={`${styles.pricingCard} ${styles.popular}`}>
            <div className={styles.cardBackground}></div>
            
            {/* Заголовок и цена */}
            <div className={styles.cardTitle}>
              <h3 className={styles.planName}>Базовый</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>$59</span>
                <span className={styles.period}>4 занятия / мес</span>
              </div>
            </div>
            
            {/* Описание */}
            <p className={styles.description}>
              Поддержка регулярных занятий и закрепление материала
            </p>
            
            {/* Первый разделитель */}
            <div className={styles.divider}></div>
            
            {/* Список преимуществ */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Индивидуальные уроки (1 раз в неделю)</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Домашние задания и рекомендации</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Доступ к обучающим играм</span>
              </div>
            </div>
            
            {/* Второй разделитель */}
            <div className={styles.divider}></div>
            
            {/* Подзаголовок */}
            <p className={styles.subtitle}>Подходит для неспешного темпа и начального уровня</p>
            
            {/* Кнопка */}
            <div className={styles.buttonContainer}>
              <Button 
                variant="primary" 
                size="large"
                className={styles.enrollButton}
              >
                Записаться
              </Button>
            </div>
          </div>
          
          {/* Карточка 3: Интенсив */}
          <div className={styles.pricingCard}>
            <div className={styles.cardBackground}></div>
            
            {/* Заголовок и цена */}
            <div className={styles.cardTitle}>
              <h3 className={styles.planName}>Интенсив</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>$99</span>
                <span className={styles.period}>8 занятий / мес</span>
              </div>
            </div>
            
            {/* Описание */}
            <p className={styles.description}>
              Быстрый прогресс и уверенное владение языком
            </p>
            
            {/* Первый разделитель */}
            <div className={styles.divider}></div>
            
            {/* Список преимуществ */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Индивидуальные занятия (2 раза в неделю)</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Разговорный клуб в подарок</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Отслеживание прогресса и отчёты</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M14.1667 4.25L6.33333 12.0833L2.41667 8.16667" stroke="#440693" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featureText}>Поддержка в подготовке к Cambridge English</span>
              </div>
            </div>
            
            {/* Второй разделитель */}
            <div className={styles.divider}></div>
            
            {/* Подзаголовок */}
            <p className={styles.subtitle}>Лучший выбор для максимального результата</p>
            
            {/* Кнопка */}
            <div className={styles.buttonContainer}>
              <Button 
                variant="primary" 
                size="large"
                className={styles.enrollButton}
              >
                Записаться
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 