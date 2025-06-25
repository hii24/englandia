import { Modal, Input, Button } from "@/components/ui";
import React, { useState } from "react";

interface LoginModalProps {
  onSubmit: (data: { email: string; password: string }) => Promise<any>;
  onClose: () => void;
  onRegisterClick: () => void;
}

const initialState = {
  email: "",
  password: "",
};

const LoginModal: React.FC<LoginModalProps> = ({
  onSubmit,
  onClose,
  onRegisterClick,
}) => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (field: string, value: string) => {
    let error = '';
    if (field === 'email') {
      if (!value) error = 'Введите email';
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) error = 'Некорректный email';
    }
    if (field === 'password') {
      if (!value) error = 'Введите пароль';
      else if (value.length < 6) error = 'Минимум 6 символов';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Валидация на лету, но ошибки не показываем до submit
    validate(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    // Проверяем все поля перед отправкой
    const emailError = validate('email', form.email);
    const passwordError = validate('password', form.password);
    if (emailError || passwordError) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } catch (error: any) {
      setServerError(error?.message || 'Ошибка входа');
      console.error('Ошибка входа:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <form
        className="flex flex-col gap-5 login-modal-form"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-bold text-2xl">
          Вход в систему
        </h2>
        
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          error={submitted ? errors.email : undefined}
        />
        
        <div className="relative">
          <Input
            placeholder="Пароль"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            error={submitted ? errors.password : undefined}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {serverError && (
          <div className="text-center text-red-600 text-sm mt-2">{serverError}</div>
        )}

        <div className="flex justify-center">
          <Button type="submit" showIcon disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Нет аккаунта?
          </p>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
            onClick={onRegisterClick}
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal; 