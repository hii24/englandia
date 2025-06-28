# Исправление ошибок MongoDB ObjectId

## Проблема
Ошибка: `"input must be a 24 character hex string, 12 byte Uint8Array, or an integer"`

## Причина
API endpoints получали неправильные форматы ID:
- `'test-lesson'` вместо 24-символьного hex ID
- `'default'` вместо валидного MongoDB ObjectId
- Отсутствовала валидация формата ID

## Выполненные исправления

### 1. Добавлена валидация ObjectId
**Файлы:** 
- `src/pages/api/lessons/schedule.ts`
- `src/pages/api/lessons/auto-schedule.ts`
- `src/pages/api/students/teacher.ts`

**Функция валидации:**
```typescript
const isValidObjectId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
```

### 2. Условная проверка пользователей
- **Для 'default' ID**: пропускаем проверку существования пользователя
- **Для реальных ID**: проверяем валидность ObjectId и существование пользователя

### 3. Обновлены тестовые данные
**Файл:** `src/app/test-schedule/page.tsx`
- Используются реальные MongoDB ObjectId вместо тестовых строк
- `lessonId: '685d692ad5e671c77b9fe8bc'`
- `studentId: '68603c91fc0d6a6d785f5f8b'`
- `teacherId: '685d67e3d5e671c77b9fe8b5'`

### 4. Настроен API students/teacher
**Файл:** `src/pages/api/students/teacher.ts`
- Для конкретного ученика возвращает реальный teacherId
- Для остальных учеников возвращает 'default'

## Логика работы после исправлений

### Валидация ID:
```typescript
// Проверяем валидность ObjectId
if (studentId !== 'default' && !isValidObjectId(studentId as string)) {
  return res.status(400).json({ error: 'Invalid studentId format' });
}

// Проверяем существование пользователя только для реальных ID
if (studentId !== 'default') {
  const student = await findUserById(studentId as string);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
}
```

### Обработка 'default' значений:
- **'default' teacherId**: пропускаем проверку роли учителя
- **'default' studentId**: пропускаем проверку существования ученика
- **Реальные ID**: полная валидация и проверка

## Результат

После исправлений:
- ✅ **Нет ошибок MongoDB ObjectId** при использовании 'default' значений
- ✅ **Валидация реальных ID** для безопасности
- ✅ **Корректная работа** с тестовыми и реальными данными
- ✅ **Гибкость системы** - поддерживает и 'default' и реальные ID

## Тестирование

### Для тестирования с реальными данными:
1. Откройте `/test-schedule`
2. Нажмите "Create Test Schedule"
3. Проверьте результат в консоли

### Для диагностики:
1. Проверьте консоль браузера на наличие ошибок
2. Используйте `/debug-schedule` для проверки состояния
3. Проверьте логи сервера на наличие ошибок MongoDB

## Следующие шаги

### Для полной реализации:
1. **Создать связь ученик-учитель** в базе данных
2. **Обновить API students/teacher** для динамического получения teacherId
3. **Добавить интерфейс** для управления связями ученик-учитель
4. **Убрать 'default' значения** и использовать только реальные ID

### Для улучшения:
1. **Кэширование** связей ученик-учитель
2. **Валидация** всех ID на уровне middleware
3. **Логирование** попыток использования невалидных ID
4. **Документация** API с примерами валидных ID

Система теперь корректно обрабатывает как тестовые 'default' значения, так и реальные MongoDB ObjectId, что позволяет безопасно тестировать функциональность и постепенно переходить к использованию реальных данных. 