import React, { useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { updateAttendance, fetchStudentLesson } from '@/lib/api';
import { useUserStore } from '@/store/userStore';

interface AttendanceTabProps {
  selectedStudent: any;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ selectedStudent }) => {
  const lessons = useLessonStore((s: any) => s.lessons);
  const loadLessons = useLessonStore((s: any) => s.loadLessons);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const user = useUserStore(s => s.user);

  useEffect(() => {
    if (selectedStudent) {
      loadLessons();
    }
  }, [selectedStudent, loadLessons]);

  // Загружаем существующие данные о посещениях
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!selectedStudent || !lessons.length) return;
      
      setInitialLoading(true);
      const attendance: Record<string, boolean> = {};
      
      try {
        // Загружаем данные о посещениях для каждого урока
        await Promise.all(
          lessons.map(async (lesson: any) => {
            try {
              const data = await fetchStudentLesson(selectedStudent._id, lesson._id);
              attendance[lesson._id] = data.attended || false;
            } catch (error: any) {
              // Если данные не найдены (404), это нормально - значит посещение еще не отмечалось
              if (error.response?.status === 404) {
                console.log(`Нет данных о посещении для урока ${lesson._id} - это нормально`);
                attendance[lesson._id] = false;
              } else {
                console.error(`Ошибка загрузки данных для урока ${lesson._id}:`, error);
                attendance[lesson._id] = false;
              }
            }
          })
        );
        
        setAttendanceData(attendance);
      } catch (error) {
        console.error('Ошибка загрузки данных о посещениях:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAttendanceData();
  }, [selectedStudent, lessons]);

  const handleAttendanceChange = async (lessonId: string, attended: boolean) => {
    if (!selectedStudent || !user?._id) {
      alert('Ошибка: не удалось определить ученика или учителя');
      return;
    }

    setLoading(prev => ({ ...prev, [lessonId]: true }));
    
    try {
      console.log('Отправляем данные:', {
        studentId: selectedStudent._id,
        lessonId,
        attended,
        teacherId: user._id
      });
      
      await updateAttendance(selectedStudent._id, lessonId, attended, user._id);
      setAttendanceData(prev => ({ ...prev, [lessonId]: attended }));
      
      // Если это первый урок и ученик посетил его, показываем уведомление
      if (attended && lessons.find((l: any) => l._id === lessonId)?.orderNumber === 1) {
        alert('Первый урок посещен! Можно отправить email с предложением курса.');
      }
    } catch (error) {
      console.error('Ошибка обновления посещения:', error);
      alert(`Ошибка обновления посещения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  if (!selectedStudent) {
    return (
      <div className="text-center text-gray-600 py-8">
        Сначала выберите ученика
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="text-center text-gray-600 py-8">
        Загрузка данных о посещениях...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Управление посещениями</h3>
        <p className="text-gray-600">
          Ученик: <span className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Урок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус посещения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.map((lesson: any) => (
                <tr key={lesson._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Урок {lesson.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lesson.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      attendanceData[lesson._id] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {attendanceData[lesson._id] ? 'Посетил' : 'Не посетил'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendanceChange(lesson._id, true)}
                        disabled={loading[lesson._id]}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          attendanceData[lesson._id]
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
                        } transition-colors disabled:opacity-50`}
                      >
                        {loading[lesson._id] ? 'Сохранение...' : 'Отметить посещение'}
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(lesson._id, false)}
                        disabled={loading[lesson._id]}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          !attendanceData[lesson._id]
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
                        } transition-colors disabled:opacity-50`}
                      >
                        {loading[lesson._id] ? 'Сохранение...' : 'Отметить отсутствие'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Информация:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Отмечайте посещения учеников после каждого урока</li>
          <li>• При посещении первого урока система предложит отправить email с предложением курса</li>
          <li>• Статус посещения сохраняется автоматически</li>
        </ul>
      </div>
    </div>
  );
}; 