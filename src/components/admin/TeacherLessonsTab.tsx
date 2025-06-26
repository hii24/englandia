import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { fetchStudentLesson, saveStudentLesson } from '@/lib/api';

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

export const TeacherLessonsTab: React.FC<TeacherLessonsTabProps> = ({ selectedStudent }) => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
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

  useEffect(() => {
    if (selectedStudent) {
      loadLessons();
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
      <div className="w-full max-w-2xl mx-auto">
        <h4 className="text-xl font-bold mb-2">Редактирование урока</h4>
        <p className="mb-2 text-gray-600">Урок: <span className="font-semibold">{selectedLesson?.title}</span></p>
        <p className="mb-4 text-gray-600">Ученик: <span className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</span></p>
        <div className="mb-6 border-b border-gray-200 flex gap-2">
          <button className={`px-4 py-2 font-semibold rounded-t transition ${activeTab==='main' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setActiveTab('main')}>Основное</button>
          <button className={`px-4 py-2 font-semibold rounded-t transition ${activeTab==='lessonLink' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setActiveTab('lessonLink')}>Ссылка на занятие</button>
          <button className={`px-4 py-2 font-semibold rounded-t transition ${activeTab==='homework' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setActiveTab('homework')}>Домашка</button>
          <button className={`px-4 py-2 font-semibold rounded-t transition ${activeTab==='materials' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setActiveTab('materials')}>Материалы</button>
        </div>
        {activeTab === 'main' && (
          <div className="py-4">
            <input
              value={selectedLesson?.title || ''}
              disabled
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 bg-gray-100 text-base"
              placeholder="Название урока"
            />
            <textarea
              value={selectedLesson?.description || ''}
              disabled
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 bg-gray-100 text-base"
              placeholder="Описание урока"
              rows={3}
            />
          </div>
        )}
        {activeTab === 'lessonLink' && (
          <div className="py-4">
            <h5 className="text-lg font-semibold mb-2">Ссылка на занятие:</h5>
            <div className="flex flex-col gap-4">
              <input
                value={lessonLink.title}
                onChange={e => setLessonLink(l => ({ ...l, title: e.target.value }))}
                placeholder="Название ссылки"
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 text-base"
              />
              <input
                value={lessonLink.url}
                onChange={e => setLessonLink(l => ({ ...l, url: e.target.value }))}
                placeholder="URL занятия"
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 text-base"
              />
            </div>
          </div>
        )}
        {activeTab === 'homework' && (
          <div className="py-4">
            <h5 className="text-lg font-semibold mb-2">Домашние задания:</h5>
            <div className="flex flex-col gap-4">
              {homeworkData.homework.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-3 border border-gray-200">
                  <input
                    value={item.title || ''}
                    onChange={e => updateHomeworkItem(index, 'title', e.target.value)}
                    placeholder="Название задания"
                    className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 text-base"
                  />
                  <input
                    value={item.url}
                    onChange={e => updateHomeworkItem(index, 'url', e.target.value)}
                    placeholder="Ссылка"
                    className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 text-base"
                  />
                  <button
                    onClick={() => removeHomeworkItem(index)}
                    className="ml-2 px-3 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Удалить
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addHomeworkItem}
              className="mt-4 px-5 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition"
            >
              + Добавить задание
            </button>
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
            onClick={handleCancelEdit}
            className="px-5 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSaveHomework}
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
      <h4>Уроки ученика: {selectedStudent.firstName} {selectedStudent.lastName}</h4>
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
        {lessons.map((lesson: any) => (
          <div 
            key={lesson._id} 
            className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center justify-between border border-gray-200"
          >
            <div>
              <div className="font-bold text-lg">Урок {lesson.orderNumber}: {lesson.title}</div>
              <div className="text-gray-500 text-sm">{lesson.description}</div>
            </div>
            <button
              onClick={() => handleEditHomework(lesson)}
              className="ml-4 px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition"
            >
              Редактировать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 