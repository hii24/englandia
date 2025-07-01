import { Modal, Input, Button } from "@/components/ui";
import React, { useState } from "react";
import { loginUser } from '@/lib/api';

interface LoginModalProps {
  onClose: () => void;
  onRegisterClick: () => void;
  onSuccess?: () => void;
}

const initialState = {
  email: "",
  password: "",
};

const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onRegisterClick,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Состояние для восстановления пароля
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
    validate(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    setSuccess(false);
    
    const emailError = validate('email', form.email);
    const passwordError = validate('password', form.password);
    if (emailError || passwordError) return;
    setIsSubmitting(true);
    try {
      await loginUser(form);
      setSuccess(true);
      if (onSuccess) onSuccess();
      
      // Закрываем модалку после успешного входа с небольшой задержкой
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      setServerError(error?.message || 'Ошибка входа');
      console.error('Ошибка входа:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetSubmitted(true);
    setResetError(null);
    setResetSuccess(false);
    
    if (!resetEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(resetEmail)) {
      setResetError('Введите корректный email');
      return;
    }
    
    setIsResetting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetSuccess(true);
        setResetEmail("");
      } else {
        setResetError(data.error || 'Ошибка восстановления пароля');
      }
    } catch (error: any) {
      setResetError('Ошибка соединения с сервером');
      console.error('Ошибка восстановления пароля:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const resetForm = () => {
    setIsPasswordReset(false);
    setResetEmail("");
    setResetSubmitted(false);
    setResetError(null);
    setResetSuccess(false);
  };

  if (isPasswordReset) {
    return (
      <Modal open={true} onClose={onClose}>
        <form
          className="flex flex-col gap-5 login-modal-form"
          onSubmit={handlePasswordReset}
        >
          <h2 className="text-center font-bold text-2xl">
            Восстановление пароля
          </h2>
          
          <p className="text-center text-gray-600 text-sm">
            Введите ваш email, и мы отправим вам новый пароль
          </p>
          
          <Input
            placeholder="Email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            error={resetSubmitted && !resetEmail ? 'Введите email' : undefined}
          />

          {resetError && (
            <div className="text-center text-red-600 text-sm mt-2">{resetError}</div>
          )}
          {resetSuccess && (
            <div className="text-center text-green-600 text-sm mt-2">
              Новый пароль отправлен на ваш email!
            </div>
          )}
          
          <div className="flex justify-center">
            <Button type="submit" showIcon disabled={isResetting}>
              {isResetting ? 'Отправляем...' : 'Отправить новый пароль'}
            </Button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-sm underline cursor-pointer"
              onClick={resetForm}
            >
              ← Вернуться к входу
            </button>
          </div>
        </form>
      </Modal>
    );
  }

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
        {success && (
          <div className="text-center text-green-600 text-sm mt-2">Вход выполнен успешно!</div>
        )}
        
        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm underline cursor-pointer"
            onClick={() => setIsPasswordReset(true)}
          >
            Забыли пароль?
          </button>
        </div>
        
        <div className="text-center flex flex-row gap-2 justify-center align-middle">
          <p className="flex flex-col justify-center align-middle">
            Нет аккаунта?
          </p>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm underline cursor-pointer"
            onClick={()=>{
              console.log("onRegisterClick");
              onRegisterClick();
            }}
          >
            Зарегистрироваться
          </button>
        </div>
        <div className="flex justify-center">
          <Button type="submit" showIcon disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal; 