import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function CreateTeacherTab() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    age: 25, // учителя обычно старше 18
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const loadTeachers = async () => {
    try {
      setListLoading(true);
      const res = await fetch('/api/users?role=teacher');
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (e) {
      // noop
    } finally {
      setListLoading(false);
    }
  };

  React.useEffect(() => {
    void loadTeachers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 25 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Валидация
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Пожалуйста, заполните все обязательные поля');
      setLoading(false);
      return;
    }

    // Валидация возраста только если он указан
    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      setError('Возраст должен быть от 18 до 100 лет');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Учитель успешно зарегистрирован! Письмо с данными для входа отправлено на указанный email.');
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          age: 25,
          comment: ''
        });
        void loadTeachers();
      } else {
        setError(data.error || 'Ошибка регистрации учителя');
      }
    } catch (err: any) {
      setError('Ошибка соединения с сервером. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-teacher-container">
      <div className="create-teacher-header">
        <h2 className="create-teacher-title">Добавить нового учителя</h2>
        <p className="create-teacher-description">
          Зарегистрируйте нового учителя в системе. На указанный email будет отправлено письмо с данными для входа.
        </p>
      </div>

      {success && (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <div className="success-text">{success}</div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <div className="error-icon">✗</div>
          <div className="error-text">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-teacher-form">
        <div className="form-section">
          <h3 className="section-title">Основная информация</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Email учителя</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="teacher@example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Имя</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Иван"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Фамилия</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Иванов"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Телефон (необязательно)</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Возраст (необязательно)</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                max="100"
                placeholder="25"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Комментарий (необязательно)</label>
            <textarea
              name="comment"
              className="form-textarea"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Дополнительная информация о учителе..."
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Регистрируем учителя...' : 'Зарегистрировать учителя'}
          </button>
        </div>
      </form>

      <div className="teachers-list">
        <h3 className="section-title">Текущие учителя</h3>
        {listLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="teacher-cards">
            {teachers.map((t) => (
              <TeacherCard key={t._id} teacher={t} onDeleted={loadTeachers} />
            ))}
            {teachers.length === 0 && (
              <div className="empty-state">Пока нет учителей</div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .create-teacher-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .create-teacher-header {
          margin-bottom: 24px;
        }
        
        .create-teacher-title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        
        .create-teacher-description {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }
        
        .create-teacher-form {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .form-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        
        .form-label.required::after {
          content: ' *';
          color: #dc2626;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .form-actions {
          margin-top: auto;
          padding-top: 20px;
        }
        
        .submit-button {
          width: 100%;
          padding: 14px 24px;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #6d28d9;
        }
        
        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .success-message, .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .success-message {
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          color: #166534;
        }
        
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }
        
        .success-icon, .error-icon {
          font-size: 18px;
          font-weight: bold;
        }
        
        .success-text, .error-text {
          font-size: 14px;
          line-height: 1.4;
        }
        
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 

function TeacherCard({ teacher, onDeleted }: { teacher: any; onDeleted: () => void }) {
  const [deleting, setDeleting] = React.useState(false);
  const handleDelete = async () => {
    if (!confirm(`Удалить учителя ${teacher.firstName} ${teacher.lastName}? Ученики будут отвязаны, расписания удалены.`)) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/users/${teacher._id}`);
      if (res.status >= 200 && res.status < 300) {
        onDeleted();
      } else {
        const msg = (res.data && res.data.error) ? res.data.error : 'Не удалось удалить учителя';
        alert(msg);
      }
    } catch (e) {
      alert('Ошибка соединения');
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="teacher-card">
      <div className="teacher-card__info">
        <div className="teacher-card__name">{teacher.firstName} {teacher.lastName}</div>
        <div className="teacher-card__email">{teacher.email}</div>
      </div>
      <button className="delete-button" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Удаление...' : 'Удалить'}
      </button>
      <style jsx>{`
        .teacher-card { display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; }
        .teacher-card__name { font-weight: 600; color: #1e293b; }
        .teacher-card__email { color: #64748b; font-size: 13px; }
        .delete-button { padding: 8px 12px; background: #ef4444; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
        .delete-button:disabled { background: #9ca3af; cursor: not-allowed; }
        .teacher-cards { display: flex; flex-direction: column; }
      `}</style>
    </div>
  );
}