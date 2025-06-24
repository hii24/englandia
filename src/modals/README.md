# Система модальных окон

Система модальных окон построена на Zustand для управления состоянием и предоставляет удобный API для работы с различными типами модальных окон.

## Структура

```
src/
├── store/
│   └── modalStore.ts          # Zustand store для управления модальными окнами
├── providers/
│   └── ModalProvider.tsx      # Провайдер для рендеринга модальных окон
├── hooks/
│   └── useModal.ts           # Хук для удобного использования модальных окон
└── modals/
    ├── index.ts              # Экспорт всех модальных окон
    ├── ConfirmModal.tsx      # Модальное окно подтверждения
    ├── InfoModal.tsx         # Информационное модальное окно
    ├── FormModal.tsx         # Модальное окно с формой
    ├── modals.scss           # Стили для модальных окон
    └── README.md             # Документация
```

## Установка

Система уже настроена в проекте. ModalProvider добавлен в `src/app/layout.tsx`.

## Использование

### 1. Базовое использование

```tsx
import { useModal } from '@/hooks/useModal';

const MyComponent = () => {
  const { openConfirmModal, openInfoModal, openFormModal } = useModal();

  const handleDelete = () => {
    openConfirmModal({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить этот элемент?',
      onConfirm: () => {
        // Логика удаления
        console.log('Элемент удален');
      },
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });
  };

  const showInfo = () => {
    openInfoModal({
      title: 'Информация',
      message: 'Операция выполнена успешно!',
      buttonText: 'Понятно',
    });
  };

  const showForm = () => {
    openFormModal({
      title: 'Регистрация',
      onSubmit: (data) => {
        console.log('Данные формы:', data);
      },
      submitText: 'Зарегистрироваться',
      cancelText: 'Отмена',
    });
  };

  return (
    <div>
      <button onClick={handleDelete}>Удалить</button>
      <button onClick={showInfo}>Показать информацию</button>
      <button onClick={showForm}>Открыть форму</button>
    </div>
  );
};
```

### 2. Кастомные модальные окна

```tsx
import { useModal } from '@/hooks/useModal';

const MyComponent = () => {
  const { openCustomModal } = useModal();

  const CustomModal = ({ onClose, title }: { onClose: () => void; title: string }) => (
    <div className="custom-modal">
      <h3>{title}</h3>
      <p>Содержимое кастомного модального окна</p>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );

  const showCustomModal = () => {
    openCustomModal(CustomModal, { title: 'Мое модальное окно' });
  };

  return (
    <button onClick={showCustomModal}>
      Открыть кастомное модальное окно
    </button>
  );
};
```

### 3. Создание нового типа модального окна

1. Создайте новый компонент в папке `src/modals/`:

```tsx
// src/modals/MyCustomModal.tsx
import React from 'react';
import { Modal } from '../components/ui/Modal';

interface MyCustomModalProps {
  title?: string;
  data: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

const MyCustomModal: React.FC<MyCustomModalProps> = ({
  title = 'Мое модальное окно',
  data,
  onSave,
  onClose,
}) => {
  return (
    <Modal open={true} onClose={onClose} title={title}>
      <div className="my-custom-modal">
        {/* Ваше содержимое */}
        <button onClick={() => onSave(data)}>Сохранить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </Modal>
  );
};

export default MyCustomModal;
```

2. Добавьте функцию в хук `useModal`:

```tsx
// src/hooks/useModal.ts
import MyCustomModal from '../modals/MyCustomModal';

export const useModal = () => {
  // ... существующий код ...

  const openMyCustomModal = (props: {
    title?: string;
    data: any;
    onSave: (data: any) => void;
  }) => {
    const modalConfig: ModalConfig = {
      id: 'my-custom',
      component: MyCustomModal,
      props: {
        ...props,
        onClose: closeModal,
      },
    };
    openModal(modalConfig);
  };

  return {
    // ... существующие функции ...
    openMyCustomModal,
  };
};
```

3. Экспортируйте в `src/modals/index.ts`:

```tsx
export { default as MyCustomModal } from './MyCustomModal';
```

## API

### useModal()

Возвращает объект с функциями для открытия различных типов модальных окон:

- `openConfirmModal(props)` - Модальное окно подтверждения
- `openInfoModal(props)` - Информационное модальное окно
- `openFormModal(props)` - Модальное окно с формой
- `openCustomModal(component, props?)` - Кастомное модальное окно
- `closeModal()` - Закрыть текущее модальное окно

### openConfirmModal(props)

```tsx
interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

### openInfoModal(props)

```tsx
interface InfoModalProps {
  title?: string;
  message: string;
  buttonText?: string;
}
```

### openFormModal(props)

```tsx
interface FormModalProps {
  title?: string;
  onSubmit: (data: any) => void;
  submitText?: string;
  cancelText?: string;
}
```

### openCustomModal(component, props?)

```tsx
openCustomModal(
  React.ComponentType<any>,
  Record<string, any>?
)
```

## Стилизация

Все стили для модальных окон находятся в `src/modals/modals.scss`. Вы можете:

1. Изменить существующие стили
2. Добавить новые классы для кастомных модальных окон
3. Переопределить стили в компонентах

## Преимущества системы

1. **Централизованное управление** - все модальные окна управляются через Zustand store
2. **Типизация** - полная поддержка TypeScript
3. **Переиспользование** - готовые компоненты для частых случаев
4. **Гибкость** - возможность создания кастомных модальных окон
5. **Простота использования** - удобный API через хук useModal 