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
    name: 'Наталья',
    description: 'Основатель школы “EngLandia” · Высшее лингвистическое образование · Переводчик-лингвист · Canadian Teacher Diploma · Руководитель/преподаватель в школе “KidLand” · Методист · Опыт преподавания в Канаде 17 лет · Стаж 20 лет+',
    image: '/teacher/1 Наталья.png',
    emoji: '🎓'
  },
  {
    id: 2,
    name: 'Жанна',
    description: 'Администратор школы “EngLandia” · Высшее лингвистическое образование · Магистратура/Аспирантура в университете · Методист/Учитель английского языка · Зав. отделением иностранных языков в пед. колледже · Подготовка студентов к международным экзаменам · Стаж 20 лет +',
    image: '/teacher/2 Жанна.png',
    emoji: '📚'
  },
  {
    id: 3,
    name: 'Андрей',
    description: 'Высшее лингвистическое образование · Переводчик-лингвист · Учитель английского языка · Проведение интерактивных занятий в онлайн формате · Опыт работы за рубежом 9 лет · Стаж 12 лет+',
    image: '/teacher/3 Андрей.png',
    emoji: '🧠'
  },
  {
    id: 4,
    name: 'Любовь',
    description: 'Высшее лингвистическое образование · Учитель английского языка · Ведение English Speaking Clubs · Опыт в онлайн формате 8 лет · Стаж 10 лет +',
    image: '/teacher/4 Любовь.png',
    emoji: '💬'
  },
  {
    id: 5,
    name: 'Селима',
    description: 'Высшее лингвистическое образование · Учитель английского языка · Подготовка к международным экзаменам · Учитель в школе “Foxeng” · Стаж 7 лет +',
    image: '/teacher/5 Селима.png',
    emoji: '🏅'
  },
  {
    id: 6,
    name: 'Карина',
    description: 'Высшее лингвистическое образование · Учитель английского языка · Опыт работы в оффлайн школе · Проведение интерактивных онлайн занятий · Стаж 5 лет +',
    image: '/teacher/6 Карина.png',
    emoji: '🧩'
  },
  {
    id: 7,
    name: 'Александра',
    description: 'Высшее лингвистическое образование · Переводчик-лингвист · Сертификат CEFR — Уровень языка C1 · Учитель английского языка в “Skillbox” · Стаж 5 лет +',
    image: '/teacher/7 Александра.png',
    emoji: '✅'
  },
  {
    id: 8,
    name: 'Анастасия',
    description: 'Высшее образование · Факультет международных отношений · Сертификат CEFR — Уровень языка C1 · Проведение интерактивных онлайн занятий · Стаж 6 лет+',
    image: '/teacher/8 Анастасия.png',
    emoji: '🌍'
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