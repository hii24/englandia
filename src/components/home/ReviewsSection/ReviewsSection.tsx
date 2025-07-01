'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { useModal } from '@/hooks/useModal';
import styles from './ReviewsSection.module.scss';

const allReviews = [
  {
    name: 'Анна',
    avatar: '/person-1.jpg',
    childAge: 'дочке 5 лет',
    text: 'Мы в восторге от занятий! Маша с удовольствием ждёт каждый урок. Уже через месяц она начала называть животных и предметы по-английски!'
  },
  {
    name: 'Марина',
    avatar: '/person-2.jpg',
    childAge: 'дочке 8 лет',
    text: 'До EngLand Даша ходила к частному репетитору, но потом наши друзья порекомендовали именно эту школу. Мы записались на бесплатное пробное занятие и дочка уже не захотела возвращаться к репетитору. Сказала, что у вас всё красочно, весело и интересно, особенно ей понравились обучающие компьютерные игры.'
  },
  {
    name: 'Александр',
    avatar: '/person-3.jpg',
    childAge: 'сыну 11 лет',
    text: 'Очень довольны результатом! Сын подтянул английский с тройки на четвёрку всего за 1 четверть. Преподаватель очень внимателен к Артему, а занятия проходят в дружелюбной атмосфере.'
  },
  {
    name: 'Юлия',
    avatar: '/person-4.jpg',
    childAge: 'дочке 6 лет',
    text: 'Спасибо EngLand за креативный подход в обучении! Уроки настолько яркие и интересные, что дочка запоминает английские слова и даже целые фразы прямо на занятиях! Она с удовольствием делает и домашние задания, как письменные, так и устные с анимационными играми на сайте.'
  },
  {
    name: 'Оксана',
    avatar: '/person-5.jpg',
    childAge: 'дочке 6 лет',
    text: 'Лизе очень нравится заниматься в EngLand. Она воспринимает уроки больше как игру! Вместе с учителем они поют песни, играют в интересные игры, дочке понравилось помогать эльфу находить английские слова, чтобы колдунья не превратила его в большую жабу:)'
  },
  {
    name: 'Наталья',
    avatar: '/person-6.jpg',
    childAge: 'сыну 7 лет',
    text: 'Спасибо за замечательные уроки! Саша с интересом занимается, ждёт новых заданий и теперь каждый вечер сам включает английские песни и подпевает!'
  },
  // Дополнительные отзывы для функции "Показать больше"
  {
    name: 'Елена',
    avatar: '/person-1.jpg',
    childAge: 'дочке 7 лет',
    text: 'Замечательная школа! Дочка полюбила английский язык и теперь мечтает поехать в Англию. Учителя профессиональные, материал подается в игровой форме.'
  },
  {
    name: 'Дмитрий',
    avatar: '/person-2.jpg',
    childAge: 'сыну 9 лет',
    text: 'Сын стал более уверенно говорить на английском. Очень нравится интерактивный подход и современные методики обучения.'
  },
  {
    name: 'Светлана',
    avatar: '/person-3.jpg',
    childAge: 'дочке 12 лет',
    text: 'Отличные результаты за короткое время! Дочка подтянула грамматику и значительно расширила словарный запас.'
  }
];

interface ReviewsSectionProps {
  id?: string;
}

export default function ReviewsSection({ id }: ReviewsSectionProps) {
  const [visibleReviews, setVisibleReviews] = useState(6);
  const { openRegistrationModal } = useModal();

  const handleFreeLesson = () => {
    openRegistrationModal();
  };

  // Параллакс
  const sectionRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ img1: { x: 0, y: 0 }, img2: { x: 0, y: 0 } });

  // Получаем ширину окна для отключения параллакса на мобильных
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth <= 1024) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Коэффициенты для параллакса
      const k1 = 30; // для первой картинки
      const k2 = 50; // для второй картинки
      setParallax({
        img1: {
          x: (x - centerX) / k1,
          y: (y - centerY) / k1,
        },
        img2: {
          x: (x - centerX) / k2,
          y: (y - centerY) / k2,
        },
      });
    };
    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const handleShowMore = () => {
    setVisibleReviews(prev => Math.min(prev + 3, allReviews.length));
  };

  const displayedReviews = allReviews.slice(0, visibleReviews);

  const renderReviewCard = (review: typeof allReviews[0], index: number) => (
    <div key={index} className={styles.reviewCard}>
      <div className={styles.quoteSection}>
        <div className={styles.quoteIcon}>
          <Image 
            src="/quote-icon.svg" 
            alt="Кавычки" 
            width={24} 
            height={18}
          />
        </div>
        <p className={styles.reviewText}>{review.text}</p>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.avatarWrap}>
          <Image 
            src={review.avatar} 
            alt={review.name} 
            width={50} 
            height={50}
            className={styles.avatar}
          />
        </div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{review.name}</div>
          <div className={styles.childAge}>{review.childAge}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className={styles.reviewsSection} id={id}>
      <div className={styles.container} ref={sectionRef}>
        {/* Декоративные изображения */}
        <div
          className={styles.decorativeImage1}
          style={isDesktop ? {
            transform: `translate3d(${parallax.img1.x}px, ${parallax.img1.y}px, 0)`
          } : {}}
        >
          <Image
            src="/reviews-image-1.jpg"
            alt="Декоративное изображение"
            width={197}
            height={197}
            className={styles.decorImage}
          />
        </div>
        <div
          className={styles.decorativeImage2}
          style={isDesktop ? {
            transform: `translate3d(${parallax.img2.x}px, ${parallax.img2.y}px, 0)`
          } : {}}
        >
          <Image
            src="/reviews-image-2.jpg"
            alt="Декоративное изображение"
            width={153}
            height={209}
            className={styles.decorImage}
          />
        </div>

        {/* Заголовок */}
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Отзывы</h2>
          <p className={styles.subtitle}>
            Что говорят о нас дети и их родители
          </p>
        </div>

        {/* Десктопная сетка карточек */}
        <div className={styles.reviewsGrid}>
          {/* Первая колонка */}
          <div className={styles.column}>
            {displayedReviews
              .filter((_, i) => i % 3 === 0)
              .map((review, i) => renderReviewCard(review, i * 3))}
          </div>

          {/* Вторая колонка */}
          <div className={styles.column}>
            {displayedReviews
              .filter((_, i) => i % 3 === 1)
              .map((review, i) => renderReviewCard(review, i * 3 + 1))}
          </div>

          {/* Третья колонка */}
          <div className={styles.column}>
            {displayedReviews
              .filter((_, i) => i % 3 === 2)
              .map((review, i) => renderReviewCard(review, i * 3 + 2))}
          </div>
        </div>

        {/* Мобильный слайдер */}
        <div className={styles.mobileSlider}>
          <div className={styles.sliderContainer}>
            {displayedReviews.map((review, index) =>
              renderReviewCard(review, index)
            )}
          </div>
        </div>

        {/* Кнопки */}
        <div className={styles.buttons}>
          {visibleReviews < allReviews.length && (
            <button className={styles.moreButton} onClick={handleShowMore}>
              Показать больше отзывов
            </button>
          )}

          <Button
            variant="primary"
            size="large"
            className={styles.mainButton}
            showIcon
            onClick={handleFreeLesson}
          >
            Бесплатное занятие
          </Button>
        </div>
      </div>
    </section>
  );
} 