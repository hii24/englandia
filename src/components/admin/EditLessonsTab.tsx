import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface EditLessonData {
  title: string;
  description: string;
  orderNumber: number;
  materials: Array<{
    title: string;
    url: string;
    type: string;
    forStudent: boolean;
  }>;
}

export const EditLessonsTab: React.FC = () => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const editLesson = useLessonStore((s: any) => s.editLesson);
  const removeLesson = useLessonStore((s: any) => s.removeLesson);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<EditLessonData>({
    title: '',
    description: '',
    orderNumber: 1,
    materials: [],
  });
  const [activeTab, setActiveTab] = useState<'main' | 'materials'>('main');

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  // Отладочная информация
  useEffect(() => {
    console.log('Уроки загружены:', lessons);
  }, [lessons]);

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setEditData({
      title: lesson.title,
      description: lesson.description,
      orderNumber: lesson.orderNumber,
      materials: lesson.materials || [],
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedLesson) return;
    
    try {
      const lessonId = selectedLesson._id || selectedLesson.id;
      console.log('Редактирование урока:', {
        lessonId,
        selectedLesson,
        editData
      });
      
      await editLesson(lessonId, editData);
      setEditMode(false);
      setSelectedLesson(null);
      loadLessons();
      alert('Урок успешно обновлен!');
    } catch (error) {
      console.error('Ошибка обновления урока:', error);
      alert('Ошибка обновления урока');
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;
    if (!window.confirm('Удалить этот урок?')) return;
    try {
      const lessonId = selectedLesson._id || selectedLesson.id;
      await removeLesson(lessonId);
      setEditMode(false);
      setSelectedLesson(null);
      loadLessons();
      alert('Урок удалён!');
    } catch (error) {
      console.error('Ошибка удаления урока:', error);
      alert('Ошибка удаления урока');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedLesson(null);
  };

  const addMaterial = () => setEditData(data => ({
    ...data,
    materials: [...(data.materials || []), { title: '', url: '', type: 'link', forStudent: false }]
  }));

  const removeMaterial = (idx: number) => setEditData(data => ({
    ...data,
    materials: data.materials.filter((_, i) => i !== idx)
  }));

  const updateMaterial = (idx: number, patch: any) => setEditData(data => ({
    ...data,
    materials: data.materials.map((m, i) => i === idx ? { ...m, ...patch } : m)
  }));

  if (editMode) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <h4 className="text-xl font-bold mb-2">Редактирование урока</h4>
        <div className="mb-6 border-b border-gray-200 flex gap-2">
          <button className={`px-4 py-2 font-semibold rounded-t transition ${activeTab==='main' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setActiveTab('main')}>Основное</button>
          <button className={`px-4 py-2 font-semibold rounded-t transition ${activeTab==='materials' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setActiveTab('materials')}>Материалы</button>
        </div>
        {activeTab === 'main' && (
          <div className="py-4">
            <input
              value={editData.title}
              onChange={e => setEditData({...editData, title: e.target.value})}
              placeholder="Название урока"
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 text-base"
            />
            <textarea
              value={editData.description}
              onChange={e => setEditData({...editData, description: e.target.value})}
              placeholder="Описание урока"
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 text-base"
              rows={3}
            />
            <input
              type="number"
              value={editData.orderNumber}
              onChange={e => setEditData({...editData, orderNumber: Number(e.target.value)})}
              placeholder="Порядковый номер"
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 text-base"
              min={1}
            />
          </div>
        )}
        {activeTab === 'materials' && (
          <div className="py-4">
            <h5 className="text-lg font-semibold mb-2">Материалы:</h5>
            <div className="flex flex-col gap-4">
              {(editData.materials || []).map((mat, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-3 border border-gray-200">
                  <input
                    value={mat.title}
                    onChange={e => updateMaterial(idx, { title: e.target.value })}
                    placeholder="Название"
                    className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 text-base"
                  />
                  <input
                    value={mat.url}
                    onChange={e => updateMaterial(idx, { url: e.target.value })}
                    placeholder="Ссылка"
                    className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 text-base"
                  />
                  <label className="flex items-center gap-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!mat.forStudent}
                      onChange={e => updateMaterial(idx, { forStudent: e.target.checked })}
                      className="accent-violet-600 w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Показывать ученику</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeMaterial(idx)}
                    className="ml-2 px-3 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-1"
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
              className="mt-4 px-5 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition"
            >
              + Добавить материал
            </button>
          </div>
        )}
        <div className="flex gap-4 justify-end mt-8">
          <button
            onClick={handleDeleteLesson}
            className="px-5 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition"
          >
            Удалить урок
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-5 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-5 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition"
          >
            Сохранить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {lessons.map((lesson: any) => (
          <div 
            key={lesson._id || lesson.id} 
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
  );
}; 