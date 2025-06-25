import React, { useState, useEffect } from 'react';

export const AssignTeachersTab: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadUsers();
  }, []);

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

  return (
    <div>
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
  );
}; 