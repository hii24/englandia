'use client';
import React, { useState } from 'react';
import { Button, Text, Input, NumberInput } from '../ui';
import { Modal } from '../ui/Modal/Modal';

export const ComponentExamples: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="component-examples">
      <Text variant="h1" size="3xl" weight="bold" className="mb-6">
        Примеры компонентов
      </Text>
    <NumberInput value={value} min={5} max={18} onChange={setValue} label="Количество"/>
      {/* Modal Example */}
      <section className="mb-8">
        <Text variant="h2" size="2xl" weight="semibold" className="mb-4">
          Модалка
        </Text>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Открыть модалку
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={<>
            Оплата не прошла <span role="img" aria-label="sad">😔</span>
          </>}
        >
          <div style={{ marginBottom: 16 }}>
            <b>Что-то пошло не так.</b>
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              Пожалуйста, попробуйте снова или используйте другую карту.<br/>
              Если проблема повторится — напишите нам, и мы обязательно поможем!
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Попробовать снова
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Назад
            </Button>
          </div>
        </Modal>
      </section>

      {/* Button Examples */}
      <section className="mb-8">
        <Text variant="h2" size="2xl" weight="semibold" className="mb-4">
          Кнопки
        </Text>
        
        <div className="flex gap-4 mb-4">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" showIcon>Отправить</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
        
        <div className="flex gap-4 mb-4">
          <Button variant="outline">Outline</Button>
          <Button variant="outline" showIcon>Подробнее</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
        
        <div className="flex gap-4 mb-4">
          <Button size="small">Small</Button>
          <Button size="small" showIcon>Маленькая</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
          <Button size="xl">XL</Button>
        </div>

        <div className="flex gap-4">
          <Button variant="primary" showIcon fullWidth>Полная ширина с иконкой</Button>
        </div>
      </section>

      {/* Text Examples */}
      <section className="mb-8">
        <Text variant="h2" size="2xl" weight="semibold" className="mb-4">
          Текст
        </Text>
        
        <div className="space-y-2 mb-4">
          <Text variant="h1" size="4xl" weight="bold">Заголовок H1</Text>
          <Text variant="h2" size="3xl" weight="semibold">Заголовок H2</Text>
          <Text variant="h3" size="2xl" weight="semibold">Заголовок H3</Text>
          <Text variant="body" size="large">Обычный текст большого размера</Text>
          <Text variant="body" size="medium">Обычный текст среднего размера</Text>
          <Text variant="caption" size="small" color="muted">Подпись</Text>
        </div>
        
        <div className="space-y-2">
          <Text color="primary">Основной цвет</Text>
          <Text color="secondary">Вторичный цвет</Text>
          <Text color="success">Цвет успеха</Text>
          <Text color="danger">Цвет ошибки</Text>
          <Text color="warning">Цвет предупреждения</Text>
        </div>
      </section>

      {/* Input Examples */}
      <section className="mb-8">
        <Text variant="h2" size="2xl" weight="semibold" className="mb-4">
          Поля ввода
        </Text>
        
        <div className="space-y-4 max-w-md">
          <Input 
            label="Обычное поле"
            placeholder="Введите текст"
            helperText="Вспомогательный текст"
          />
          
          <Input 
            label="Поле с ошибкой"
            placeholder="Введите email"
            error="Неверный формат email"
            variant="outlined"
          />
          
          <Input 
            label="Обязательное поле"
            placeholder="Введите пароль"
            required
            type="password"
            variant="filled"
          />
          
          <Input 
            label="Отключенное поле"
            placeholder="Недоступно"
            disabled
            variant="underlined"
          />
          
          <Input 
            label="Поле с иконками"
            placeholder="Поиск..."
            leftIcon="🔍"
            rightIcon="✕"
            variant="ghost"
          />
        </div>
      </section>
    </div>
  );
}; 