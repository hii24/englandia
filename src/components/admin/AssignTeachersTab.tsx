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
    <div className="assign-teachers-container">
      <h4 className="section-title">Назначение учителей ученикам</h4>
      <div className="students-list">
        {students.map((student: any) => (
          <div 
            key={student._id} 
            className="student-card"
          >
            <div className="student-info">
              <div className="student-name">{student.firstName} {student.lastName}</div>
              <div className="student-email">{student.email}</div>
            </div>
            <div className="teacher-assignment">
              <label className="assignment-label">Назначить учителя:</label>
              <select
                value={assignments[student._id] || ''}
                onChange={(e) => handleAssignTeacher(student._id, e.target.value)}
                className="teacher-select"
              >
                <option value="">Не назначен</option>
                {teachers.map((teacher: any) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="empty-state">
            Нет учеников для назначения учителей
          </div>
        )}
      </div>

      <style jsx>{`
        .assign-teachers-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .section-title {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        .students-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }
        .student-card {
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 16px;
          background: white;
          transition: all 0.2s;
        }
        .student-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
        }
        .student-info {
          margin-bottom: 16px;
        }
        .student-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .student-email {
          font-size: 14px;
          color: #64748b;
        }
        .teacher-assignment {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .assignment-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        .teacher-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
        }
        .teacher-select:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .empty-state {
          text-align: center;
          color: #64748b;
          padding: 40px 20px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}; 