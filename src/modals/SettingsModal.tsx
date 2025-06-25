import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useLessonStore } from '@/store/lessonStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const user = useUserStore(s => s.user);
  const [tab, setTab] = useState(0);
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const editLesson = useLessonStore((s: any) => s.editLesson);
  const addLesson = useLessonStore((s: any) => s.addLesson);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    orderNumber: 1
  });
  
  // Состояния для назначения учителей
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<{[key: string]: string}>({});
  
  // Состояния для создания урока
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    orderNumber: 1,
    videoUrl: '',
    materials: [],
    additionalMaterials: [],
    homework: []
  });

  useEffect(() => {
    if (isOpen && user?.role === 'admin') {
      loadLessons();
      loadUsers();
    }
  }, [isOpen, user?.role, loadLessons]);

  const loadUsers = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        fetch('/api/users?role=student,guest'),
        fetch('/api/users?role=teacher')
      ]);
      const studentsData = await studentsRes.json();
      const teachersData = await teachersRes.json();
      setStudents(studentsData);
      setTeachers(teachersData);
      
      // Загружаем текущие назначения
      const currentAssignments: {[key: string]: string} = {};
      studentsData.forEach((student: any) => {
        if (student.teacherId) {
          currentAssignments[student._id] = student.teacherId;
        }
      });
      setAssignments(currentAssignments);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const handleAssignTeacher = async (studentId: string, teacherId: string) => {
    try {
      await fetch(`/api/users/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId })
      });
      setAssignments({...assignments, [studentId]: teacherId});
    } catch (error) {
      console.error('Ошибка назначения учителя:', error);
    }
  };

  const handleCreateLesson = async () => {
    try {
      await addLesson(newLesson);
      setNewLesson({
        title: '',
        description: '',
        orderNumber: 1,
        videoUrl: '',
        materials: [],
        additionalMaterials: [],
        homework: []
      });
      setTab(2); // Переключаемся на вкладку редактирования
    } catch (error) {
      console.error('Ошибка создания урока:', error);
    }
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setEditData({
      title: lesson.title,
      description: lesson.description,
      orderNumber: lesson.orderNumber
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedLesson) return;
    
    await editLesson(selectedLesson.id, editData);
    setEditMode(false);
    setSelectedLesson(null);
    loadLessons();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedLesson(null);
  };

  const adminTabs = [
    { 
      label: 'Назначить учителя', 
      content: (
        <div>
          <h4>Назначение учителей ученикам</h4>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {students.map((student: any) => (
              <div 
                key={student._id} 
                style={{ 
                  padding: 12, 
                  border: '1px solid #ddd', 
                  borderRadius: 8, 
                  marginBottom: 8 
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong>{student.firstName} {student.lastName}</strong>
                  <div style={{ fontSize: 14, color: '#666' }}>{student.email}</div>
                </div>
                <select
                  value={assignments[student._id] || ''}
                  onChange={(e) => handleAssignTeacher(student._id, e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    borderRadius: 6, 
                    border: '1px solid #ddd' 
                  }}
                >
                  <option value="">Не назначен</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )
    },
    { 
      label: 'Создать урок', 
      content: (
        <div>
          <h4>Создание нового урока</h4>
          <input
            value={newLesson.title}
            onChange={e => setNewLesson({...newLesson, title: e.target.value})}
            placeholder="Название урока"
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <textarea
            value={newLesson.description}
            onChange={e => setNewLesson({...newLesson, description: e.target.value})}
            placeholder="Описание урока"
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd', minHeight: 80 }}
          />
          <input
            type="number"
            value={newLesson.orderNumber}
            onChange={e => setNewLesson({...newLesson, orderNumber: Number(e.target.value)})}
            placeholder="Порядковый номер"
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <input
            value={newLesson.videoUrl}
            onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
            placeholder="URL видео (опционально)"
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <button 
            onClick={handleCreateLesson}
            style={{ 
              background: '#7c3aed', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '12px 24px', 
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Создать урок
          </button>
        </div>
      )
    },
    { 
      label: 'Редактировать уроки', 
      content: (
        <div>
          {editMode ? (
            <div>
              <h4>Редактирование урока</h4>
              <input
                value={editData.title}
                onChange={e => setEditData({...editData, title: e.target.value})}
                placeholder="Название урока"
                style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
              />
              <textarea
                value={editData.description}
                onChange={e => setEditData({...editData, description: e.target.value})}
                placeholder="Описание урока"
                style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd', minHeight: 80 }}
              />
              <input
                type="number"
                value={editData.orderNumber}
                onChange={e => setEditData({...editData, orderNumber: Number(e.target.value)})}
                placeholder="Порядковый номер"
                style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={handleSaveEdit}
                  style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
                >
                  Сохранить
                </button>
                <button 
                  onClick={handleCancelEdit}
                  style={{ background: '#6b7280', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h4>Список уроков</h4>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {lessons.map((lesson: any) => (
                  <div 
                    key={lesson.id} 
                    style={{ 
                      padding: 12, 
                      border: '1px solid #ddd', 
                      borderRadius: 8, 
                      marginBottom: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>Урок {lesson.orderNumber}: {lesson.title}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>{lesson.description}</div>
                    </div>
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      style={{ 
                        background: '#7c3aed', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 6, 
                        padding: '6px 12px', 
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
  ];
  const teacherTabs = [
    { label: 'Ученики', content: <div>Здесь будет список учеников и действия учителя</div> },
    // Можно добавить другие вкладки для teacher
  ];
  const tabs = user?.role === 'admin' ? adminTabs : user?.role === 'teacher' ? teacherTabs : [];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal modal--wide">
        <button className="modal__close" onClick={onClose}>×</button>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              style={{
                background: tab === i ? '#ede9fe' : 'transparent',
                color: tab === i ? '#7c3aed' : '#222',
                border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ minHeight: 200 }}>{tabs[tab]?.content}</div>
      </div>
      <style jsx>{`
        .modal-overlay { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #fff; border-radius: 16px; padding: 32px 24px; min-width: 420px; max-width: 90vw; box-shadow: 0 4px 32px rgba(0,0,0,0.12); position: relative; }
        .modal--wide { min-width: 600px; }
        .modal__close { position: absolute; right: 16px; top: 16px; background: none; border: none; font-size: 28px; cursor: pointer; }
      `}</style>
    </div>
  );
}; 