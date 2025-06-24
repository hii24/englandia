# Backend архитектура для регистрации (Next.js 15)

## Общий подход

В Next.js 15 API-роуты по-прежнему располагаются в папке `pages/api/`, однако для чистоты архитектуры и удобства поддержки рекомендуется выносить всю бизнес-логику, работу с базой данных, валидацию и вспомогательные функции в отдельную папку, например, `src/server/`.

**API-роуты** отвечают только за:
- Приём HTTP-запроса
- Вызов соответствующих функций из server-слоя
- Формирование и возврат HTTP-ответа

**Вся бизнес-логика** (валидация, сохранение в БД, отправка писем и т.д.) реализуется в `src/server/`.

---

## Рекомендуемая структура

```
src/
  pages/
    api/
      registration/
        index.ts         # Только HTTP-обработчик
  server/
    registration/
      service.ts         # Логика регистрации (сохранение, обработка)
      validate.ts        # Валидация данных
    db.ts                # Работа с базой данных
  types/
    registration.ts      # Типы для регистрации
```

---

## Поток данных

1. **Фронтенд** отправляет POST-запрос на `/api/registration` с данными формы.
2. **API Route** (`pages/api/registration/index.ts`):
    - Проверяет метод запроса
    - Вызывает функцию из `server/registration/service.ts`
    - Возвращает результат клиенту
3. **Сервис** (`server/registration/service.ts`):
    - Валидирует данные (`validate.ts`)
    - Сохраняет заявку в базу (`db.ts`)
    - (Опционально) отправляет email

---

## Пример кода

**API Route:**
```ts
// src/pages/api/registration/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { handleRegistration } from '@/server/registration/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const result = await handleRegistration(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (e: any) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: e.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

**Сервис:**
```ts
// src/server/registration/service.ts
import { validateRegistration } from './validate';
import { saveRegistration } from '../db';
import type { RegistrationData } from '@/types/registration';

export async function handleRegistration(data: RegistrationData) {
  validateRegistration(data);
  return await saveRegistration(data);
}
```

**Валидация:**
```ts
// src/server/registration/validate.ts
import type { RegistrationData } from '@/types/registration';

export function validateRegistration(data: RegistrationData) {
  if (!data.firstName || !data.email) {
    const error = new Error('Имя и email обязательны');
    (error as any).name = 'ValidationError';
    throw error;
  }
  // ...другая валидация
}
```

---

## Преимущества подхода

- **Чистота кода:** API-роуты не захламлены бизнес-логикой
- **Переиспользуемость:** server-слой можно использовать в других местах (например, для server actions)
- **Тестируемость:** бизнес-логику легко покрывать unit-тестами
- **Масштабируемость:** легко добавлять новые сервисы и роуты

---

## Как добавить новый API-роут

1. Создайте файл-обработчик в `pages/api/your-route/index.ts`
2. Вынесите бизнес-логику в `server/your-route/`
3. Описывайте типы в `types/`

---

## Рекомендации

- Используйте строгую типизацию для всех данных
- Вынесите бизнес-логику из API Route в отдельные модули (`server/`)
- Для сложных сценариев используйте middlewares (например, для rate limiting)
- Не храните секреты в коде — используйте переменные окружения

---

**Этот README описывает рекомендуемый подход к организации backend-части в Next.js 15 с использованием API Routes и выделением server-слоя.** 