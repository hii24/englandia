import React from 'react';
import styles from './PricingSection.module.scss';
import { Button } from '@/components/ui';

export default function PricingSection() {
  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Цены</h2>

        <div className={styles.pricingGrid}>
          {/* Пробный тариф */}
          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planTitle}>Пробный</h3>
              <div className={styles.priceInfo}>
                <span className={styles.price}>бесплатно</span>
                <span className={styles.period}>1 занятие</span>
              </div>
            </div>

            <p className={styles.description}>
              Познакомимся, определим уровень, ребёнок попробует формат и
              получит красочный сертификат.
            </p>

            <div className={styles.separator}></div>

            <ul className={styles.featuresList}>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>25 минут индивидуального урока</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Подходит для детей 4–12 лет</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Без обязательств</span>
              </li>
            </ul>

            <div className={styles.separator}></div>

            <p className={styles.recommendation}>
              Идеально для знакомства со школой
            </p>

            <div className={styles.ctaButton}>
              <Button showIcon>Записаться</Button>
            </div>
          </div>

          {/* Базовый тариф (Рекомендуемый) */}
          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planTitle}>Базовый</h3>
              <div className={styles.priceInfo}>
                <span className={styles.price}>$59</span>
                <span className={styles.period}>4 занятия / мес</span>
              </div>
            </div>

            <p className={styles.description}>
              Поддержка регулярных занятий и закрепление материала
            </p>

            <div className={styles.separator}></div>

            <ul className={styles.featuresList}>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Индивидуальные уроки (1 раз в неделю)</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Домашние задания и рекомендации</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Доступ к обучающим играм</span>
              </li>
            </ul>

            <div className={styles.separator}></div>

            <p className={styles.recommendation}>
              Подходит для неспешного темпа и начального уровня
            </p>

            <div className={styles.ctaButton}>
              <Button showIcon>Записаться</Button>
            </div>
          </div>

          {/* Интенсив тариф */}
          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planTitle}>Интенсив</h3>
              <div className={styles.priceInfo}>
                <span className={styles.price}>$99</span>
                <span className={styles.period}>8 занятий / мес</span>
              </div>
            </div>

            <p className={styles.description}>
              Быстрый прогресс и уверенное владение языком
            </p>

            <div className={styles.separator}></div>

            <ul className={styles.featuresList}>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Индивидуальные занятия (2 раза в неделю)</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Разговорный клуб в подарок</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Отслеживание прогресса и отчёты</span>
              </li>
              <li className={styles.feature}>
                <div className={styles.checkIcon}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M14.1666 4.25L6.33329 12.0833L2.83329 8.58333"
                      stroke="#440693"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Поддержка в подготовке к Cambridge English</span>
              </li>
            </ul>

            <div className={styles.separator}></div>

            <p className={styles.recommendation}>
              Лучший выбор для максимального результата
            </p>

            <div className={styles.ctaButton}>
              <Button showIcon>Записаться</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 