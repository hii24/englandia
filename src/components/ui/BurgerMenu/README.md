# BurgerMenu Component

Переиспользуемый компонент бургер-меню с абсолютным позиционированием для мобильных устройств.

## Особенности

- ✅ Абсолютное позиционирование поверх всего контента
- ✅ Плавные анимации появления/исчезновения
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ **Пустой базовый компонент** - все содержимое передается через children
- ✅ Переиспользуемый компонент с кастомным содержимым
- ✅ Автоматическое закрытие при клике вне меню
- ✅ Поддержка клавиши Escape для закрытия

## Использование

### Базовое использование (пустой компонент)

```tsx
import { BurgerMenu } from '@/components/ui/BurgerMenu';
import { useBurgerMenu } from '@/hooks/useBurgerMenu';

const MyComponent = () => {
  const { isOpen, toggle } = useBurgerMenu();

  return (
    <BurgerMenu isOpen={isOpen} onToggle={toggle}>
      {/* Все содержимое передается через children */}
      <div className="burger-menu-authenticated">
        <button className="burger-menu-item">Мой профиль</button>
        <button className="burger-menu-item danger">Выйти</button>
      </div>
    </BurgerMenu>
  );
};
```

### Для домашней страницы (неавторизованные пользователи)

```tsx
import { BurgerMenuHome } from '@/components/BurgerMenuHome';
import { useBurgerMenu } from '@/hooks/useBurgerMenu';

const HomePage = () => {
  const { isOpen, toggle } = useBurgerMenu();

  return <BurgerMenuHome isOpen={isOpen} onToggle={toggle} />;
};
```

### Для дашборда (авторизованные пользователи)

```tsx
import { BurgerMenuDashboard } from '@/components/BurgerMenuDashboard';
import { useBurgerMenu } from '@/hooks/useBurgerMenu';

const DashboardPage = () => {
  const { isOpen, toggle } = useBurgerMenu();

  return <BurgerMenuDashboard isOpen={isOpen} onToggle={toggle} />;
};
```

### Кастомное содержимое

```tsx
<BurgerMenu isOpen={isOpen} onToggle={toggle}>
  <div className="burger-menu-authenticated">
    <h4 className="burger-menu-section-title">Мое меню</h4>
    <button className="burger-menu-item">
      Кастомная кнопка 1
    </button>
    <button className="burger-menu-item primary">
      Кастомная кнопка 2
    </button>
    <button className="burger-menu-item danger">
      Кастомная кнопка 3
    </button>
    <div className="burger-menu-section">
      <p className="burger-menu-text">
        Любое кастомное содержимое
      </p>
    </div>
  </div>
</BurgerMenu>
```

## Хук useBurgerMenu

```tsx
import { useBurgerMenu } from '@/hooks/useBurgerMenu';

const { isOpen, toggle, close, open } = useBurgerMenu();
```

### Методы

- `isOpen` - текущее состояние меню (boolean)
- `toggle()` - переключить состояние меню
- `close()` - закрыть меню
- `open()` - открыть меню

## CSS Классы

### Основные классы

- `.burger-menu-overlay` - оверлей меню
- `.burger-menu-panel` - панель меню
- `.burger-menu-header` - заголовок меню
- `.burger-menu-content` - содержимое меню

### Классы для элементов

- `.burger-menu-item` - элемент меню (кнопка)
- `.burger-menu-item.primary` - основная кнопка
- `.burger-menu-item.danger` - опасная кнопка (красная)
- `.burger-menu-text` - текст в меню
- `.burger-menu-section` - секция меню
- `.burger-menu-section-title` - заголовок секции

### Классы для состояний

- `.burger-menu-authenticated` - для авторизованных пользователей
- `.burger-menu-unauthenticated` - для неавторизованных пользователей

## Анимации

Компонент использует Headless UI Transition для плавных анимаций:

- Появление: слайд справа налево
- Исчезновение: слайд слева направо
- Длительность: 300ms

## Адаптивность

- На экранах > 768px: кнопка бургер-меню скрыта
- На экранах ≤ 768px: кнопка бургер-меню видна
- На экранах ≤ 480px: меню занимает всю ширину экрана

## Архитектура

Базовый компонент `BurgerMenu` теперь **полностью пустой** и содержит только:
- Кнопку бургер-меню
- Структуру оверлея и панели
- Анимации
- Логику открытия/закрытия

**Все содержимое** передается через `children` prop, что делает компонент максимально гибким и переиспользуемым.

## Примеры

Смотрите файлы:
- `src/components/BurgerMenuHome.tsx` - пример для домашней страницы
- `src/components/BurgerMenuDashboard.tsx` - пример для дашборда
- `src/components/examples/BurgerMenuExamples.tsx` - демонстрация всех возможностей 