'use client';

import Image from 'next/image';
import { Button } from "@/components/ui";
import { useModal } from "@/hooks/useModal";
import styles from './Hero.module.scss';

export default function Hero() {
  const { openRegistrationModal } = useModal();

  const handleGetStarted = () => {
    openRegistrationModal();
  };

  const tags = [
    '🧒 Для детей 4–12 лет',
    '🎓 Программа на основе Кембриджа, Оксфорда',
    '🕹️ Игровая форма обучения',
    '💬 Разговорный клуб',
    '🧩 Интерактивные занятия',
    '👩‍🏫 Опытные преподаватели',
    '🎁 Бесплатные материалы и игры',
    '🎓 Европейский стандарт обучения CEFR'
  ];

  const persons = [
    { src: '/person-1.jpg', alt: 'Ученик 1' },
    { src: '/person-2.jpg', alt: 'Ученик 2' },
    { src: '/person-3.jpg', alt: 'Ученик 3' },
    { src: '/person-4.jpg', alt: 'Ученик 4' },
    { src: '/person-5.jpg', alt: 'Ученик 5' }
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Background with images */}
        <div className={styles.background}>
          <div className={styles.gradientBg}></div>
          <div className={styles.images}>
            <Image 
              src="/hero-girl.jpg" 
              alt="Девочка изучает английский" 
              width={430} 
              height={572}
              className={styles.mainImage}
              priority
            />
            <Image 
              src="/hero-image-1.jpg" 
              alt="Обучение английскому" 
              width={234} 
              height={234}
              className={styles.image1}
            />
            <Image 
              src="/hero-image-2.jpg" 
              alt="Интерактивные занятия" 
              width={161} 
              height={161}
              className={styles.image2}
            />
            <Image 
              src="/hero-image-3.jpg" 
              alt="Игровое обучение" 
              width={316} 
              height={253}
              className={styles.image3}
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Title */}
          <div className={styles.title}>
            <h1>
              <span>Английский, в который </span>
              <div className={styles.titleLine}>
                <span>влюбляются</span>
                <span>с первого</span>
              </div>
              <span>урока</span>
            </h1>
          </div>

          {/* Persons */}
          <div className={styles.persons}>
            <div className={styles.personsList}>
              {persons.map((person, index) => (
                <div key={index} className={styles.personAvatar}>
                  <Image 
                    src={person.src} 
                    alt={person.alt} 
                    width={50} 
                    height={50}
                  />
                </div>
              ))}
            </div>
            <p className={styles.personsText}>
              Более 1000 довольных учеников и их родителей
            </p>
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>

          {/* Button and description */}
          <div className={styles.action}>
            <Button 
              className={styles.actionButton}
              onClick={handleGetStarted}
              showIcon={true}
            >
              Бесплатное занятие
            </Button>
            <p className={styles.actionDescription}>
              Первое занятие — бесплатно. Определим уровень, покажем формат, выдадим рекомендации и сертификат.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 