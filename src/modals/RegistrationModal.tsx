import { Modal, NumberInput, Input, Button } from "@/components/ui";
import React, { useState } from "react";

interface RegistrationModalProps {
  onSubmit: (data: any) => Promise<any>;
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
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    age?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (field: string, value: string | number) => {
    let error = '';
    if (field === 'firstName') {
      if (!value || typeof value === 'string' && !value.trim()) error = 'Введите имя';
    }
    if (field === 'lastName') {
      if (!value || typeof value === 'string' && !value.trim()) error = 'Введите фамилию';
    }
    if (field === 'email') {
      if (!value || typeof value === 'string' && !value.trim()) error = 'Введите email';
      else if (typeof value === 'string' && !/^[^@]+@[^@]+\.[^@]+$/.test(value)) error = 'Некорректный email';
    }
    if (field === 'phone') {
      if (!value || typeof value === 'string' && !value.trim()) error = 'Введите телефон';
      // Можно добавить маску/регулярку для телефона
    }
    if (field === 'age') {
      if (typeof value === 'number' && (value < 4 || value > 12)) error = 'Возраст от 4 до 12';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    // Проверяем все поля
    const firstNameError = validate('firstName', form.firstName);
    const lastNameError = validate('lastName', form.lastName);
    const emailError = validate('email', form.email);
    const phoneError = validate('phone', form.phone);
    const ageError = validate('age', form.age);
    if (firstNameError || lastNameError || emailError || phoneError || ageError) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } catch (error: any) {
      setServerError(error?.message || 'Ошибка регистрации');
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
          error={submitted ? errors.firstName : undefined}
        />
        <Input
          placeholder="Фамилия"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
          error={submitted ? errors.lastName : undefined}
        />
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          error={submitted ? errors.email : undefined}
        />
        <Input
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
          error={submitted ? errors.phone : undefined}
        />

        <NumberInput
          label="Возраст ребенка, лет"
          value={form.age}
          min={4}
          max={12}
          onChange={(value) => handleChange("age", value)}
          error={submitted ? errors.age : undefined}
        />

        <Input
          placeholder="Комментарий (необязательно)"
          value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
        />
        {serverError && (
          <div className="text-center text-red-600 text-sm mt-2">{serverError}</div>
        )}
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
