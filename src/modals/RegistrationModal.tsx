import { Modal, NumberInput, Input, Button } from "@/components/ui";
import React, { useState } from "react";

interface RegistrationModalProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: 5,
  comment: "",
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onSubmit,
  onClose,
}) => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Базовая валидация на фронтенде
    if (!form.firstName.trim()) {
      alert('Пожалуйста, введите имя');
      return;
    }
    
    if (!form.lastName.trim()) {
      alert('Пожалуйста, введите фамилию');
      return;
    }
    
    if (!form.email.trim()) {
      alert('Пожалуйста, введите email');
      return;
    }
    
    if (!form.phone.trim()) {
      alert('Пожалуйста, введите телефон');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(form);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <form
        className="flex flex-col gap-5 registration-modal-form"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-bold text-2xl">
          Запишитесь на бесплатное занятие
        </h2>
        <Input
          placeholder="Имя"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
        <Input
          placeholder="Фамилия"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <Input
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />

        <NumberInput
          label="Возраст ребенка, лет"
          value={form.age}
          min={4}
          max={12}
          onChange={(value) => handleChange("age", value)}
        />

        <Input
          placeholder="Комментарий (необязательно)"
          value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
        />
        <div className="flex justify-center">
          <Button type="submit" showIcon disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;
