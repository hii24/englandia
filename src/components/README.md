# UI Components

Система переиспользуемых компонентов для проекта Eng-Landia.

## Структура

```
src/components/
├── ui/                    # Базовые UI компоненты
│   ├── Button/           # Кнопка
│   │   ├── Button.tsx    # Компонент
│   │   ├── Button.types.ts # Типы
│   │   ├── Button.scss   # Стили
│   │   └── index.ts      # Экспорт
│   ├── Text/             # Текст
│   ├── Input/            # Поле ввода
│   └── index.ts          # Общий экспорт
├── examples/             # Примеры использования
└── README.md            # Документация
```

## Использование

### Импорт компонентов

```tsx
import { Button, Text, Input } from '@/components/ui';
```

### Button

```tsx
// Базовое использование
<Button>Нажми меня</Button>

// С вариантами
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// С размерами
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
<Button size="xl">XL</Button>

// Состояния
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button fullWidth>Full Width</Button>

// С иконкой (анимированная стрелка)
<Button showIcon>Отправить</Button>
<Button variant="outline" showIcon>Подробнее</Button>
<Button size="small" showIcon>Маленькая</Button>
<Button variant="primary" showIcon fullWidth>Полная ширина с иконкой</Button>
```

### Text

```tsx
// Базовое использование
<Text>Обычный текст</Text>

// Варианты
<Text variant="h1">Заголовок H1</Text>
<Text variant="h2">Заголовок H2</Text>
<Text variant="body">Обычный текст</Text>
<Text variant="caption">Подпись</Text>

// Размеры
<Text size="xs">Очень маленький</Text>
<Text size="small">Маленький</Text>
<Text size="medium">Средний</Text>
<Text size="large">Большой</Text>
<Text size="xl">Очень большой</Text>

// Веса
<Text weight="light">Легкий</Text>
<Text weight="normal">Обычный</Text>
<Text weight="medium">Средний</Text>
<Text weight="semibold">Полужирный</Text>
<Text weight="bold">Жирный</Text>

// Цвета
<Text color="primary">Основной</Text>
<Text color="secondary">Вторичный</Text>
<Text color="success">Успех</Text>
<Text color="danger">Ошибка</Text>

// Выравнивание
<Text align="left">По левому краю</Text>
<Text align="center">По центру</Text>
<Text align="right">По правому краю</Text>

// Как HTML элемент
<Text as="h1">Заголовок</Text>
<Text as="p">Параграф</Text>
<Text as="span">Спан</Text>
```

### Input

```tsx
// Базовое использование
<Input placeholder="Введите текст" />

// С лейблом
<Input 
  label="Email"
  placeholder="Введите email"
  helperText="Мы не передаем ваш email третьим лицам"
/>

// Варианты
<Input variant="outlined" placeholder="Outlined" />
<Input variant="filled" placeholder="Filled" />
<Input variant="underlined" placeholder="Underlined" />
<Input variant="ghost" placeholder="Ghost" />

// Размеры
<Input size="small" placeholder="Small" />
<Input size="medium" placeholder="Medium" />
<Input size="large" placeholder="Large" />

// Состояния
<Input disabled placeholder="Disabled" />
<Input 
  label="Email"
  error="Неверный формат email"
  placeholder="Введите email"
/>
<Input 
  label="Пароль"
  required
  type="password"
  placeholder="Введите пароль"
/>

// С иконками
<Input 
  leftIcon="🔍"
  placeholder="Поиск..."
/>
<Input 
  rightIcon="✕"
  placeholder="Очистить"
/>
```

## Стилизация

Все компоненты используют BEM методологию для CSS классов:

- `.component` - базовый класс
- `.component--modifier` - модификатор
- `.component__element` - элемент компонента

### Примеры классов:

```scss
// Button
.button
.button--primary
.button--large
.button--disabled
.button__loader
.button__content
.button__container
.button__icon

// Text
.text
.text--h1
.text--large
.text--bold
.text--primary

// Input
.input
.input--outlined
.input--medium
.input--error
.input__label
.input__container
.input__icon
```

## Добавление новых компонентов

1. Создайте папку компонента в `src/components/ui/`
2. Создайте файлы:
   - `ComponentName.tsx` - компонент
   - `ComponentName.types.ts` - типы
   - `ComponentName.scss` - стили
   - `index.ts` - экспорт
3. Добавьте экспорт в `src/components/ui/index.ts`
4. Добавьте примеры в `src/components/examples/`

## Лучшие практики

1. **Типизация** - всегда используйте TypeScript интерфейсы
2. **Пропсы по умолчанию** - устанавливайте разумные значения по умолчанию
3. **ForwardRef** - используйте для компонентов, которые должны передавать ref
4. **BEM** - следуйте BEM методологии для CSS классов
5. **Доступность** - добавляйте ARIA атрибуты где необходимо
6. **Тестирование** - пишите тесты для компонентов 