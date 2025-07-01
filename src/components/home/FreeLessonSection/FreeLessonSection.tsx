'use client';

import Image from 'next/image';
import { Button } from "@/components/ui";
import { useModal } from "@/hooks/useModal";
import { useFallingAnimation } from "@/hooks/useFallingAnimation";
import styles from './FreeLessonSection.module.scss';

export default function FreeLessonSection() {
  const { openRegistrationModal } = useModal();

  // Инициализация анимации падающих элементов  
  const fallingTags = [
    { text: "Аудирование" },
    { text: "Чтение" },
    { text: "Лексика" },
    { text: "🌟", isEmoji: true },
    { text: "🚀", isEmoji: true },
    { text: "Письмо" },
    { text: "Грамматика" },
    { text: "Фонетика" },
    
    { text: "Произношение" },
    { text: "Интерактивные игры" },
    { text: "Видеоуроки" },
    { text: "Словарный запас" },
    { text: "Артикли" },
    { text: "📚", isEmoji: true },
    { text: "Предлоги" },


    { text: "Диктанты" },
    { text: "Проекты" },
    { text: "Групповые занятия" },
    { text: "Индивидуальные уроки" },
    { text: "🧑‍🎓", isEmoji: true },

    { text: "⭐", isEmoji: true },
    { text: "💡", isEmoji: true },  { text: "Домашние задания" },
 
    { text: "🎵", isEmoji: true },
    { text: "Разговорная практика" },
  
    { text: "Разговорный английский" },
    { text: "Доступ к материалам 24/7" },
    { text: "🎬", isEmoji: true },

   
    { text: "💯", isEmoji: true },
  ];
  

  useFallingAnimation({
    tags: fallingTags,
    triggerElement: '#free-lesson-trigger',
    canvasClass: 'falling-canvas'
  });

  const handleGetLesson = () => {
    openRegistrationModal();
  };

  const features = [
    {
      emoji: '👩‍🏫',
      text: 'Учитель проведёт увлекательное занятие с ребёнком'
    },
    {
      emoji: '🧠',
      text: 'Определит уровень владения английским'
    },
    {
      emoji: '📒',
      text: 'Подготовит рекомендации по дальнейшей программе'
    },
    {
      emoji: '🕹️',
      text: 'Пробудит интерес к английскому через общение и игру'
    },
    {
      emoji: '🤿',
      text: 'Погрузит в языковую среду — ребёнок почувствует, что английский это легко и весело'
    },
    {
      emoji: '📃',
      text: 'В конце — красочный сертификат о прохождении тестового занятия в EngLand!'
    }
  ];

  const advantages = [
    {
      title: 'Авторские методики',
      description: 'Благодаря нашим методикам, дети обучаются в 2 раза быстрее!'
    },
    {
      title: 'Особая атмосфера занятий',
      description: 'Теплая, продуктивная и увлекательная - дает возможность ребенку не только учить язык, но и раскрывать свой внутренний потенциал'
    },
    {
      title: 'Ребенок учиться верить в себя',
      description: 'В свои способности и радоваться своим успехам.'
    },
    {
      title: 'Мы не просто обучаем английскому',
      description: 'Мы учим думать, чувствовать и общаться на нем.'
    }
  ];

  return (
    <section className={styles.freeLesson} id="free-lesson-trigger">
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradientBg}></div>
        </div>
        
        {/* Canvas для анимации падающих элементов */}
        <div className="falling-canvas"></div>
        
        <div className={styles.content}>
          {/* Title */}
          <div className={styles.title}>
            <h2 className={styles.titleSmall}>Приглашаем на</h2>
            <h2 className={styles.titleLarge}>бесплатное занятие</h2>
          </div>

          {/* Main content grid */}
          <div className={styles.mainContent}>
            {/* Advantages cards */}
            <div className={styles.advantages}>
              {advantages.map((advantage, index) => (
                <div key={index} className={styles.advantageCard}>
                  <h3 className={styles.advantageTitle}>{advantage.title}</h3>
                  <p className={styles.advantageDescription}>{advantage.description}</p>
                </div>
              ))}
            </div>

            {/* Features cards */}
            <div className={styles.features}>
              <div className={styles.featuresColumn}>
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureEmoji}>
                      <div className={styles.emojiContainer}>
                        <span className={styles.emoji}>{feature.emoji}</span>
                      </div>
                    </div>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
              <div className={styles.featuresColumn}>
                {features.slice(3, 6).map((feature, index) => (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureEmoji}>
                      <div className={styles.emojiContainer}>
                        <span className={styles.emoji}>{feature.emoji}</span>
                      </div>
                    </div>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Button */}
          <div className={styles.buttonContainer}>
            <Button 
              className={styles.actionButton}
              onClick={handleGetLesson}
              showIcon={true}
            >
              Хочу на бесплатное занятие
            </Button>
          </div>

          {/* Girl image */}
          <div className={styles.girlImageContainer}>
          <Image 
              src="/free-lesson-girl.jpg" 
              alt="Девочка изучает английский" 
              width={234} 
              height={260}
              className={styles.girlImg}
            />
          </div>
          
        </div>
        <div className={styles.girlImage}>
            <Image 
              src="/free-lesson-girl.jpg" 
              alt="Девочка изучает английский" 
              width={524} 
              height={550}
              className={styles.girlImg}
            />
          </div>
      </div>
    </section>
  );
} 