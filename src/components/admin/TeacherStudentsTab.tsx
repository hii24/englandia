import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface TeacherStudentsTabProps {
  onStudentSelect: (student: any) => void;
  selectedStudentId?: string;
}

export const TeacherStudentsTab: React.FC<TeacherStudentsTabProps> = ({ 
  onStudentSelect, 
  selectedStudentId 
}) => {
  const user = useUserStore(s => s.user);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'teacher' && user?._id) {
      loadStudents();
    }
  }, [user]);

  const loadStudents = async () => {
    try {
      const response = await fetch(`/api/users?role=student,guest&teacherId=${user?._id}`);
      const studentsData = await response.json();
      setStudents(studentsData);
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
    }
  };

  return (
    <div>
      <h4>Выберите ученика</h4>
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {students.map((student: any) => (
          <div 
            key={student._id} 
            style={{ 
              padding: 12, 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              marginBottom: 8,
              cursor: 'pointer',
              background: selectedStudentId === student._id ? '#ede9fe' : 'transparent',
              borderColor: selectedStudentId === student._id ? '#7c3aed' : '#ddd'
            }}
            onClick={() => onStudentSelect(student)}
          >
            <div style={{ fontWeight: 600 }}>
              {student.firstName} {student.lastName}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              {student.email}
            </div>
          </div>
        ))}
      </div>
      {students.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
          У вас пока нет назначенных учеников
        </div>
      )}
    </div>
  );
}; 