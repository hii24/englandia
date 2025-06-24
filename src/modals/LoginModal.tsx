import { Modal, Input, Button } from "@/components/ui";
import React, { useState } from "react";

interface LoginModalProps {
  onSubmit: (data: { email: string; password: string }) => void;
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

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Базовая валидация на фронтенде
    if (!form.email.trim()) {
      alert('Пожалуйста, введите email');
      return;
    }
    
    if (!form.password.trim()) {
      alert('Пожалуйста, введите пароль');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(form);
    } catch (error) {
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
        />
        
        <div className="relative">
          <Input
            placeholder="Пароль"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

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