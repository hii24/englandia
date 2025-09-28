import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './TeachersSection.module.scss';

interface Teacher {
  id: number;
  name: string;
  description: string;
  image: string;
  emoji: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: 'Анна',
    description: 'Спокойная и внимательная. Легко находит подход даже к самым застенчивым детям. Любит работать через сказки и диалоги.',
    image: '/teacher-anna.png',
    emoji: '🧸'
  },
  {
    id: 2,
    name: 'Тимур',
    description: 'Чёткий, структурный и добрый. Легко объясняет даже сложные вещи и помогает детям поверить в себя.',
    image: '/teacher-timur.png',
    emoji: '📐'
  },
  {
    id: 3,
    name: 'Виктория',
    description: 'Обожает работать с младшими школьниками. Учит через песни, мультики и весёлые задания. Много улыбается :)',
    image: '/teacher-victoria.png',
    emoji: '😊'
  },
  {
    id: 4,
    name: 'Оливер',
    description: 'Опыт работы в международных школах. Помогает готовиться к экзаменам и ставит амбициозные, но достижимые цели.',
    image: '/teacher-oliver.png',
    emoji: '🤠'
  }
];

interface TeachersSectionProps {
  id?: string;
}

const TeachersSection: React.FC<TeachersSectionProps> = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const update = () => {
      if (typeof window !== 'undefined') {
        setVisibleCount(window.innerWidth <= 768 ? 1 : 4);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teachers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + teachers.length) % teachers.length);
  };

  const getVisibleTeachers = () => {
    const result = [];
    const count = Math.max(1, Math.min(visibleCount, teachers.length));
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % teachers.length;
      result.push(teachers[index]);
    }
    return result;
  };

  const visibleTeachers = getVisibleTeachers();

  return (
    <section className={styles.teachersSection} id={id}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2 className={styles.mainTitle}>Наши учителя</h2>
          <p className={styles.subtitle}>Профессионалы, искренне любящие своё дело и детей</p>
        </div>
        
        <div className={styles.teachersList}>
          {visibleTeachers.map((teacher, index) => (
            <div key={`${teacher.id}-${index}`} className={styles.teacherCard}>
              <div className={styles.person}>
                <div className={styles.photo}>
                  <div className={styles.photoBg}></div>
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    width={210}
                    height={315}
                    className={styles.teacherImage}
                  />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.teacherName}>{teacher.name}</h3>
                  <p className={styles.teacherDescription}>{teacher.description}</p>
                </div>
              </div>
              <div className={styles.emoji}>
                <span className={styles.emojiIcon}>{teacher.emoji}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button 
            className={styles.arrow}
            onClick={prevSlide}
            aria-label="Предыдущий учитель"
          >
            <div className={styles.arrowCircle}></div>
            <svg className={styles.arrowIcon} viewBox="0 0 19 16" fill="none">
              <path d="M8.5 1L2 8L8.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className={styles.arrow}
            onClick={nextSlide}
            aria-label="Следующий учитель"
          >
            <div className={styles.arrowCircle}></div>
            <svg className={styles.arrowIcon} viewBox="0 0 19 16" fill="none">
              <path d="M10.5 1L17 8L10.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection; 