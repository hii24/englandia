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
    bunnyVideoId: '',
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
        bunnyVideoId: '',
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
            value={newLesson.bunnyVideoId}
            onChange={e => setNewLesson({...newLesson, bunnyVideoId: e.target.value})}
            placeholder="Код видео Bunny.net (например: d2a2d931-f32e-48a4-8d76-20b1f2f714cc)"
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
      <div className="modal modal--settings">
        <button className="modal__close" onClick={onClose}>×</button>
        
        <div className="settings-content">
          <div className="settings-header">
            <h2>Настройки системы</h2>
            <p>Управление уроками, пользователями и системными настройками</p>
          </div>
          
          <div className="settings-body">
            {user?.role === 'admin' ? (
              <div className="admin-settings">
                <div className="settings-tabs">
                  {adminTabs.map((tabItem, index) => (
                    <button
                      key={index}
                      className={`settings-tab ${tab === index ? 'settings-tab--active' : ''}`}
                      onClick={() => setTab(index)}
                    >
                      {tabItem.label}
                    </button>
                  ))}
                </div>
                
                <div className="settings-panel">
                  {adminTabs[tab].content}
                </div>
              </div>
            ) : (
              <div className="user-settings">
                <h3>Настройки пользователя</h3>
                <p>Здесь будут настройки для обычных пользователей</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay { 
          position: fixed; 
          left: 0; 
          top: 0; 
          width: 100vw; 
          height: 100vh; 
          background: rgba(0,0,0,0.25); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000; 
        }
        .modal { 
          background: #fff; 
          border-radius: 16px; 
          box-shadow: 0 4px 32px rgba(0,0,0,0.12); 
          position: relative; 
          display: flex;
          width: 95vw;
          height: 95vh;
          max-width: 95vw;
          max-height: 95vh;
          overflow: hidden;
        }
        .modal--settings {
          flex-direction: column;
        }
        .modal__close { 
          position: absolute; 
          right: 16px; 
          top: 16px; 
          background: none; 
          border: none; 
          font-size: 28px; 
          cursor: pointer;
          z-index: 10;
          color: #64748b;
          transition: color 0.2s;
        }
        .modal__close:hover {
          color: #1e293b;
        }
        .settings-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .settings-header {
          padding: 32px 32px 24px 32px;
          border-bottom: 1px solid #e2e8f0;
        }
        .settings-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }
        .settings-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .settings-body {
          flex: 1;
          padding: 32px;
          overflow: hidden;
        }
        .admin-settings {
          display: flex;
          height: 100%;
          gap: 32px;
        }
        .settings-tabs {
          width: 280px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .settings-tab {
          background: none;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
        }
        .settings-tab:hover {
          background: #e2e8f0;
          color: #475569;
        }
        .settings-tab--active {
          background: #7c3aed;
          color: white;
        }
        .settings-panel {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
        }
        .user-settings {
          text-align: center;
          padding: 48px;
        }
        .user-settings h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }
        .user-settings p {
          margin: 0;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}; 