'use client';

import React, { useState } from 'react';
import { useLessonStore } from '@/store/lessonStore';

export default function TestBunnySavePage() {
  const { lessons, loadLessons, addLesson, editLesson } = useLessonStore();
  const [testVideoId, setTestVideoId] = useState('test-video-id-123');
  const [lessonTitle, setLessonTitle] = useState('Тестовый урок с видео');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editVideoId, setEditVideoId] = useState('');

  const handleCreateTestLesson = async () => {
    try {
      const testLesson = {
        title: lessonTitle,
        description: 'Тестовый урок для проверки сохранения bunnyVideoId',
        orderNumber: 999,
        bunnyVideoId: testVideoId,
        videoUrl: '',
        materials: [],
        additionalMaterials: [],
        homework: []
      };

      console.log('🔍 Test: Создаем урок с данными:', testLesson);
      await addLesson(testLesson);
      await loadLessons();
      alert('Тестовый урок создан!');
    } catch (error) {
      console.error('Ошибка создания тестового урока:', error);
      alert('Ошибка создания тестового урока');
    }
  };

  const handleEditTestLesson = async () => {
    if (!selectedLesson) {
      alert('Выберите урок для редактирования');
      return;
    }

    try {
      const lessonId = selectedLesson._id || selectedLesson.id;
      const updateData = {
        bunnyVideoId: editVideoId
      };

      console.log('🔍 Test: Обновляем урок с данными:', updateData);
      await editLesson(lessonId, updateData);
      await loadLessons();
      alert('Урок обновлен!');
    } catch (error) {
      console.error('Ошибка обновления тестового урока:', error);
      alert('Ошибка обновления тестового урока');
    }
  };

  const handleLoadLessons = async () => {
    await loadLessons();
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Тест сохранения bunnyVideoId</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Создание тестового урока</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Название урока:
              </label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Код видео (bunnyVideoId):
              </label>
              <input
                type="text"
                value={testVideoId}
                onChange={(e) => setTestVideoId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <button
              onClick={handleCreateTestLesson}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
            >
              Создать тестовый урок
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Редактирование урока</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Выберите урок:
              </label>
              <select
                value={selectedLesson?._id || ''}
                onChange={(e) => {
                  const lesson = lessons.find(l => l._id === e.target.value);
                  setSelectedLesson(lesson);
                  setEditVideoId(lesson?.bunnyVideoId || '');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Выберите урок...</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>
                    {lesson.title} (bunnyVideoId: {lesson.bunnyVideoId || 'нет'})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Новый код видео:
              </label>
              <input
                type="text"
                value={editVideoId}
                onChange={(e) => setEditVideoId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <button
              onClick={handleEditTestLesson}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
            >
              Обновить урок
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Список уроков</h2>
          <button
            onClick={handleLoadLessons}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Обновить список
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Название</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">bunnyVideoId</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lessons.map((lesson) => (
                <tr key={lesson._id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{lesson.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {lesson.bunnyVideoId || 'нет'}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setEditVideoId(lesson.bunnyVideoId || '');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 