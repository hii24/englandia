import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { fetchStudentLesson, saveStudentLesson, updateAttendance } from '@/lib/api';
import { useUserStore } from '@/store/userStore';

interface TeacherLessonsTabProps {
  selectedStudent: any;
}

interface HomeworkItem {
  url: string;
  type: 'file' | 'link';
}

interface EditData {
  materials: Array<{
    title: string;
    url: string;
    type: string;
    forStudent: boolean;
  }>;
}

interface LessonProgress {
  _id: string;
  lessonId: string;
  attended: boolean;
  attendanceDate?: string;
  attendanceConfirmedBy?: string;
  lessonLink?: { title: string; url: string; forStudent?: boolean };
  homework?: Array<{ title: string; url: string; type: 'file' | 'link' }>;
}

export const TeacherLessonsTab: React.FC<TeacherLessonsTabProps> = ({ selectedStudent }) => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const user = useUserStore(s => s.user);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [homeworkData, setHomeworkData] = useState<{ homework: HomeworkItem[] }>({
    homework: []
  });
  const [editData, setEditData] = useState<EditData>({
    materials: [],
  });
  const [activeTab, setActiveTab] = useState<'main' | 'lessonLink' | 'homework' | 'materials'>('main');
  const [lessonLink, setLessonLink] = useState<{ title: string; url: string }>({ title: '', url: '' });
  const [lessonProgresses, setLessonProgresses] = useState<LessonProgress[]>([]);
  const [loadingProgresses, setLoadingProgresses] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      loadLessons();
      loadStudentProgresses();
    }
  }, [selectedStudent, loadLessons]);

  useEffect(() => {
    if (selectedStudent && selectedLesson) {
      fetchStudentLesson(selectedStudent._id, selectedLesson._id)
        .then(data => {
          console.log('Loaded student lesson data:', data);
          setLessonLink(data.lessonLink || { title: '', url: '' });
          setHomeworkData({ homework: data.homework || [] });
        })
        .catch((error) => {
          console.error('Error loading student lesson data:', error);
          // Если данные не найдены, это нормально - устанавливаем пустые значения
          setLessonLink({ title: '', url: '' });
          setHomeworkData({ homework: [] });
        });
    }
  }, [selectedStudent, selectedLesson]);

  const loadStudentProgresses = async () => {
    if (!selectedStudent?._id) return;
    
    setLoadingProgresses(true);
    try {
      const progresses: LessonProgress[] = [];
      
      // Загружаем прогресс для каждого урока
      for (const lesson of lessons) {
        try {
          const data = await fetchStudentLesson(selectedStudent._id, lesson._id);
          progresses.push({
            _id: data._id || `${selectedStudent._id}-${lesson._id}`,
            lessonId: lesson._id,
            attended: data.attended || false,
            attendanceDate: data.attendanceDate,
            attendanceConfirmedBy: data.attendanceConfirmedBy,
            lessonLink: data.lessonLink,
            homework: data.homework
          });
        } catch (error) {
          // Если прогресс не найден, создаем запись по умолчанию
          progresses.push({
            _id: `${selectedStudent._id}-${lesson._id}`,
            lessonId: lesson._id,
            attended: false
          });
        }
      }
      
      setLessonProgresses(progresses);
    } catch (error) {
      console.error('Error loading student progresses:', error);
    } finally {
      setLoadingProgresses(false);
    }
  };

  const handleAttendanceChange = async (lessonId: string, attended: boolean) => {
    if (!user?._id || !selectedStudent?._id) return;
    
    console.log('Teacher marking attendance:', {
      studentId: selectedStudent._id,
      lessonId,
      attended,
      teacherId: user._id
    });
    
    try {
      await updateAttendance(selectedStudent._id, lessonId, attended, user._id);
      
      // Обновляем локальное состояние
      setLessonProgresses(prev => prev.map(progress => 
        progress.lessonId === lessonId 
          ? { ...progress, attended, attendanceDate: attended ? new Date().toISOString() : undefined }
          : progress
      ));
      
      console.log(`Attendance updated for lesson ${lessonId} to ${attended}`);
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Ошибка обновления посещения');
    }
  };

  const getAttendanceColor = (attended: boolean) => {
    return attended ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getAttendanceText = (attended: boolean) => {
    return attended ? 'Посетил' : 'Не посетил';
  };

  const handleEditHomework = (lesson: any) => {
    console.log('Editing lesson for student:', { lesson, student: selectedStudent });
    setSelectedLesson(lesson);
    setHomeworkData({
      homework: lesson.homework || []
    });
    setEditMode(true);
  };

  const handleSaveHomework = async () => {
    if (!selectedLesson) return;
    
    // Подготавливаем данные для сохранения
    // Передаем данные даже если они пустые, чтобы можно было очистить поля
    const lessonLinkToSave = lessonLink;
    const homeworkToSave = homeworkData.homework;
    
    console.log('Saving student lesson data:', {
      studentId: selectedStudent._id,
      lessonId: selectedLesson._id,
      lessonLink: lessonLinkToSave,
      homework: homeworkToSave
    });
    
    try {
      await saveStudentLesson(
        selectedStudent._id,
        selectedLesson._id,
        lessonLinkToSave,
        homeworkToSave
      );
      setEditMode(false);
      setSelectedLesson(null);
      alert('Данные по ученику и уроку обновлены!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert(`Ошибка обновления данных: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedLesson(null);
  };

  const addHomeworkItem = () => {
    setHomeworkData({
      homework: [...homeworkData.homework, { url: '', type: 'file' as const }]
    });
  };

  const removeHomeworkItem = (index: number) => {
    setHomeworkData({
      homework: homeworkData.homework.filter((_, i) => i !== index)
    });
  };

  const updateHomeworkItem = (index: number, field: string, value: string) => {
    const newHomework = [...homeworkData.homework];
    newHomework[index] = { ...newHomework[index], [field]: value };
    setHomeworkData({ homework: newHomework });
  };

  const addMaterial = () => setEditData(data => ({
    ...data,
    materials: [...(data.materials || []), { title: '', url: '', type: 'link', forStudent: true }]
  }));

  const removeMaterial = (idx: number) => setEditData(data => ({
    ...data,
    materials: data.materials.filter((_, i) => i !== idx)
  }));

  const updateMaterial = (idx: number, patch: any) => setEditData(data => ({
    ...data,
    materials: data.materials.map((m, i) => i === idx ? { ...m, ...patch, forStudent: true } : m)
  }));

  if (!selectedStudent) {
    return (
      <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
        Сначала выберите ученика
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="edit-lesson-container">
        <h4 className="edit-title">Редактирование урока</h4>
        <p className="edit-subtitle">Урок: <span className="lesson-name">{selectedLesson?.title}</span></p>
        <p className="edit-subtitle">Ученик: <span className="student-name">{selectedStudent.firstName} {selectedStudent.lastName}</span></p>
        
        <div className="edit-tabs">
          <button className={`edit-tab ${activeTab==='main' ? 'active' : ''}`} onClick={()=>setActiveTab('main')}>Основное</button>
          <button className={`edit-tab ${activeTab==='lessonLink' ? 'active' : ''}`} onClick={()=>setActiveTab('lessonLink')}>Ссылка на занятие</button>
          <button className={`edit-tab ${activeTab==='homework' ? 'active' : ''}`} onClick={()=>setActiveTab('homework')}>Домашка</button>
          <button className={`edit-tab ${activeTab==='materials' ? 'active' : ''}`} onClick={()=>setActiveTab('materials')}>Материалы</button>
        </div>
        
        <div className="edit-content">
          {activeTab === 'main' && (
            <div className="tab-content">
              <input
                value={selectedLesson?.title || ''}
                disabled
                className="form-input disabled"
                placeholder="Название урока"
              />
              <textarea
                value={selectedLesson?.description || ''}
                disabled
                className="form-textarea disabled"
                placeholder="Описание урока"
                rows={3}
              />
            </div>
          )}
          {activeTab === 'lessonLink' && (
            <div className="tab-content">
              <h5 className="tab-title">Ссылка на занятие:</h5>
              <div className="form-group">
                <input
                  value={lessonLink.title}
                  onChange={e => setLessonLink(l => ({ ...l, title: e.target.value }))}
                  placeholder="Название ссылки"
                  className="form-input"
                />
                <input
                  value={lessonLink.url}
                  onChange={e => setLessonLink(l => ({ ...l, url: e.target.value }))}
                  placeholder="URL занятия"
                  className="form-input"
                />
              </div>
            </div>
          )}
          {activeTab === 'homework' && (
            <div className="tab-content">
              <h5 className="tab-title">Домашние задания:</h5>
              <div className="homework-list">
                {homeworkData.homework.map((item: any, index: number) => (
                  <div key={index} className="homework-item">
                    <input
                      value={item.title || ''}
                      onChange={e => updateHomeworkItem(index, 'title', e.target.value)}
                      placeholder="Название задания"
                      className="form-input"
                    />
                    <input
                      value={item.url}
                      onChange={e => updateHomeworkItem(index, 'url', e.target.value)}
                      placeholder="Ссылка"
                      className="form-input"
                    />
                    <button
                      onClick={() => removeHomeworkItem(index)}
                      className="remove-button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addHomeworkItem}
                className="add-button"
              >
                + Добавить задание
              </button>
            </div>
          )}
          {activeTab === 'materials' && (
            <div className="tab-content">
              <h5 className="tab-title">Материалы:</h5>
              <div className="materials-list">
                {(editData.materials || []).map((mat, idx) => (
                  <div key={idx} className="material-item">
                    <input
                      value={mat.title}
                      onChange={e => updateMaterial(idx, { title: e.target.value })}
                      placeholder="Название"
                      className="form-input"
                    />
                    <input
                      value={mat.url}
                      onChange={e => updateMaterial(idx, { url: e.target.value })}
                      placeholder="Ссылка"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaterial(idx)}
                      className="remove-button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMaterial}
                className="add-button"
              >
                + Добавить материал
              </button>
            </div>
          )}
        </div>
        
        <div className="edit-actions">
          <button
            onClick={handleCancelEdit}
            className="cancel-button"
          >
            Отмена
          </button>
          <button
            onClick={handleSaveHomework}
            className="save-button"
          >
            Сохранить
          </button>
        </div>

        <style jsx>{`
          .edit-lesson-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 20px;
          }
          .edit-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px 0;
          }
          .edit-subtitle {
            color: #64748b;
            margin: 0 0 4px 0;
            font-size: 14px;
          }
          .lesson-name, .student-name {
            font-weight: 600;
            color: #1e293b;
          }
          .edit-tabs {
            display: flex;
            gap: 2px;
            margin: 24px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .edit-tab {
            padding: 12px 16px;
            border: none;
            background: #f1f5f9;
            color: #64748b;
            font-weight: 600;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            transition: all 0.2s;
          }
          .edit-tab.active {
            background: #7c3aed;
            color: white;
          }
          .edit-content {
            flex: 1;
            overflow-y: auto;
          }
          .tab-content {
            padding: 20px 0;
          }
          .tab-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 16px 0;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
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
          .form-input.disabled, .form-textarea.disabled {
            background: #f8fafc;
            color: #64748b;
          }
          .homework-list, .materials-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
          }
          .homework-item, .material-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            gap: 12px;
            align-items: center;
          }
          .remove-button {
            padding: 8px 12px;
            background: #fef2f2;
            color: #dc2626;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
          }
          .remove-button:hover {
            background: #fee2e2;
          }
          .add-button {
            padding: 12px 20px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .add-button:hover {
            background: #6d28d9;
          }
          .edit-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          .cancel-button {
            padding: 10px 20px;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .cancel-button:hover {
            background: #4b5563;
          }
          .save-button {
            padding: 10px 20px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .save-button:hover {
            background: #6d28d9;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="teacher-lessons-container">
      <h4 className="section-title">Уроки ученика: {selectedStudent.firstName} {selectedStudent.lastName}</h4>
      {loadingProgresses && (
        <div className="loading-indicator">
          Загрузка прогресса...
        </div>
      )}
      <div className="lessons-list">
        {lessons.map((lesson: any) => {
          const progress = lessonProgresses.find(p => p.lessonId === lesson._id);
          const isAttended = progress?.attended || false;
          
          return (
            <div 
              key={lesson._id} 
              className="lesson-card"
            >
              <div className="lesson-content">
                <div className="lesson-header">
                  <div className="lesson-title">Урок {lesson.orderNumber}: {lesson.title}</div>
                  <div className="lesson-description">{lesson.description}</div>
                </div>
                
                {/* Статус посещения */}
                <div className="attendance-section">
                  <span className="attendance-label">Статус:</span>
                  <span className={`attendance-badge ${isAttended ? 'attended' : 'not-attended'}`}>
                    {getAttendanceText(isAttended)}
                  </span>
                  {progress?.attendanceDate && (
                    <span className="attendance-date">
                      Посещён: {new Date(progress.attendanceDate).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>
                
                {/* Кнопки изменения посещения */}
                <div className="attendance-buttons">
                  <button
                    onClick={() => handleAttendanceChange(lesson._id, false)}
                    className={`attendance-button not-attended ${!isAttended ? 'active' : ''}`}
                  >
                    Не посетил
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(lesson._id, true)}
                    className={`attendance-button attended ${isAttended ? 'active' : ''}`}
                  >
                    Посетил
                  </button>
                </div>
              </div>
              
              <div className="lesson-actions">
                <button
                  onClick={() => handleEditHomework(lesson)}
                  className="edit-button"
                >
                  Редактировать
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .teacher-lessons-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
        }
        .loading-indicator {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
        .lessons-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lesson-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.2s;
        }
        .lesson-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
        }
        .lesson-content {
          flex: 1;
        }
        .lesson-header {
          margin-bottom: 16px;
        }
        .lesson-title {
          font-weight: 600;
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .lesson-description {
          color: #64748b;
          font-size: 14px;
        }
        .attendance-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .attendance-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .attendance-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .attendance-badge.attended {
          background: #dcfce7;
          color: #166534;
        }
        .attendance-badge.not-attended {
          background: #f1f5f9;
          color: #475569;
        }
        .attendance-date {
          font-size: 12px;
          color: #64748b;
        }
        .attendance-buttons {
          display: flex;
          gap: 8px;
        }
        .attendance-button {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .attendance-button.not-attended {
          background: #f1f5f9;
          color: #475569;
        }
        .attendance-button.not-attended:hover {
          background: #e2e8f0;
        }
        .attendance-button.not-attended.active {
          background: #e2e8f0;
          color: #1e293b;
        }
        .attendance-button.attended {
          background: #f0fdf4;
          color: #166534;
        }
        .attendance-button.attended:hover {
          background: #dcfce7;
        }
        .attendance-button.attended.active {
          background: #dcfce7;
          color: #166534;
        }
        .lesson-actions {
          margin-left: 20px;
        }
        .edit-button {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .edit-button:hover {
          background: #6d28d9;
        }
      `}</style>
    </div>
  );
}; 