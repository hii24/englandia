# Структура базы данных для платформы обучения

## Основные модели

### 1. User (Пользователь)
```typescript
interface User {
  _id: ObjectId;
  firstName: string;           // Имя
  lastName: string;            // Фамилия
  email: string;              // Email (уникальный)
  phone: string;              // Телефон (обязательный)
  age: number;                // Возраст
  comment?: string;           // Комментарий при регистрации
  password: string;           // Автогенерируемый пароль (хэшированный)
  role: 'admin' | 'teacher' | 'student' | 'guest'; // Роль
  isEmailVerified: boolean;   // Подтверждён ли email
  subscription?: ObjectId;    // Ссылка на активную подписку
  teacherId?: ObjectId;       // ID учителя (для студентов)
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Subscription (Подписка)
```typescript
interface Subscription {
  _id: ObjectId;
  userId: ObjectId;           // ID пользователя
  type: 'basic' | 'intensive'; // Тип: базовый (4 урока) или интенсивный (8 уроков)
  status: 'active' | 'cancelled' | 'expired'; // Статус подписки
  startDate: Date;            // Дата начала
  endDate: Date;              // Дата окончания
  autoRenewal: boolean;       // Автопродление
  paymentMethod?: string;     // Метод оплаты
  lessonsPerMonth: number;    // Количество уроков в месяц (4 или 8)
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Lesson (Урок)
```typescript
interface Lesson {
  _id: ObjectId;
  title: string;              // Название урока
  description: string;        // Описание
  orderNumber: number;        // Порядковый номер урока
  materials: {                // Учебные материалы
    title: string;
    url: string;              // Ссылка на материал
    type: 'link' | 'file';    // Тип материала
  }[];
  additionalMaterials: {      // Дополнительные материалы
    title: string;
    url: string;
    type: 'link' | 'file';
  }[];
  homework: {                 // Домашние задания
    title: string;
    url: string;              // Ссылка на файл или Google Docs
    type: 'link' | 'file';
  }[];
  isActive: boolean;          // Активен ли урок
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. LessonSession (Занятие)
```typescript
interface LessonSession {
  _id: ObjectId;
  lessonId: ObjectId;         // ID урока
  teacherId: ObjectId;        // ID учителя
  scheduledDate: Date;        // Запланированная дата/время
  meetingLink?: string;       // Ссылка на Zoom/Meet
  status: 'scheduled' | 'completed' | 'cancelled'; // Статус занятия
  attendees: {                // Участники
    studentId: ObjectId;
    isPresent: boolean;       // Присутствовал ли
    completedAt?: Date;       // Когда было отмечено присутствие
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. StudentProgress (Прогресс студента)
```typescript
interface StudentProgress {
  _id: ObjectId;
  studentId: ObjectId;        // ID студента
  lessonId: ObjectId;         // ID урока
  status: 'not_started' | 'in_progress' | 'completed'; // Статус прохождения
  completedAt?: Date;         // Дата завершения урока
  sessionsAttended: number;   // Количество посещённых занятий по этому уроку
  teacherNotes?: string;      // Заметки учителя
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. Schedule (Расписание)
```typescript
interface Schedule {
  _id: ObjectId;
  teacherId: ObjectId;        // ID учителя
  studentId: ObjectId;        // ID студента
  lessonId: ObjectId;         // ID урока
  scheduledDate: Date;        // Дата и время занятия
  duration: number;           // Длительность в минутах
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetingLink?: string;       // Ссылка на встречу
  createdAt: Date;
  updatedAt: Date;
}
```

## Бизнес-логика и доступы

### Роли и права доступа:

**Guest (Гость):**
- Видит только первый урок
- Может видеть только название и описание урока
- Не может скачивать материалы
- После прохождения первого урока получает письмо с оплатой

**Student (Студент):**
- Видит текущий урок и следующий (определяется по прогрессу)
- Может скачивать домашние задания
- Видит своё расписание
- Доступ зависит от активной подписки

**Teacher (Учитель):**
- Видит всех своих учеников
- Может отмечать присутствие
- Может редактировать ссылки на занятия
- Видит прогресс учеников
- Может добавлять заметки к прогрессу

**Admin (Администратор):**
- Полный доступ ко всем данным
- Может создавать/редактировать уроки
- Может назначать учителей
- Может управлять расписанием
- Может создавать учителей

### Алгоритм определения доступных уроков:

```typescript
function getAvailableLessons(user: User): Lesson[] {
  switch (user.role) {
    case 'guest':
      return lessons.filter(lesson => lesson.orderNumber === 1);
    
    case 'student':
      if (!hasActiveSubscription(user)) {
        return []; // Нет доступа без подписки
      }
      const currentProgress = getCurrentProgress(user.id);
      const currentLessonNumber = currentProgress.maxCompletedLesson + 1;
      return lessons.filter(lesson => 
        lesson.orderNumber <= currentLessonNumber + 1 // Текущий + следующий
      );
    
    case 'teacher':
    case 'admin':
      return lessons; // Полный доступ
  }
}
```

### Процесс после первого урока:

1. Учитель отмечает присутствие студента на первом уроке
2. Система проверяет, есть ли у пользователя активная подписка
3. Если нет подписки → отправляется email с предложением оплаты
4. После оплаты роль меняется с 'guest' на 'student'

### Email-уведомления:

**При регистрации:**
- Подтверждение email
- Логин (email) и сгенерированный пароль

**После первого урока (для гостей):**
- Предложение оформить подписку
- Ссылка на оплату

## Индексы для оптимизации:

```typescript
// User
{ email: 1 } // уникальный
{ phone: 1 } // уникальный
{ role: 1, teacherId: 1 }

// LessonSession
{ teacherId: 1, scheduledDate: 1 }
{ "attendees.studentId": 1 }

// StudentProgress
{ studentId: 1, lessonId: 1 } // составной уникальный
{ studentId: 1, status: 1 }

// Schedule
{ teacherId: 1, scheduledDate: 1 }
{ studentId: 1, scheduledDate: 1 }

// Lesson
{ orderNumber: 1 } // уникальный
{ isActive: 1 }
```

## Схемы валидации (Mongoose/Class-validator):

```typescript
// Пример для User
@Schema()
export class User {
  @Prop({ required: true, trim: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsPhoneNumber()
  phone: string;

  @Prop({ required: true, min: 8, max: 12 })
  @IsInt()
  @Min(8)
  @Max(12)
  age: number;

  @Prop({ enum: ['admin', 'teacher', 'student', 'guest'], default: 'guest' })
  @IsEnum(['admin', 'teacher', 'student', 'guest'])
  role: string;

  // ... остальные поля
}
```

Эта структура покрывает все требования и позволяет гибко управлять доступами, прогрессом и подписками учеников.

Ключевые решения:

Роли: Чёткое разделение прав доступа через enum
Подписки: Отдельная модель для управления оплатой и типами подписок
Прогресс: Отслеживание прохождения каждого урока каждым студентом
Расписание: Гибкая система записи на занятия через админа
Занятия: Отдельная сущность для каждого проведённого урока с отметками присутствия

Логика доступов:

Гость видит только 1-й урок
Студент видит текущий + следующий урок (зависит от прогресса)
Учитель видит всё + может управлять своими учениками
Админ имеет полный доступ

Автоматизация:

Email после регистрации с логином/паролем
Email с оплатой после первого урока для гостей
Автоматическая смена роли после оплаты
Контроль доступа через активную подписку

Нужно ли что-то дополнить или изменить в этой структуре?