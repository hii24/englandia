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
    <div className="teacher-students-container">
      <h4 className="section-title">Выберите ученика</h4>
      <div className="students-list">
        {students.map((student: any) => (
          <div 
            key={student._id} 
            className={`student-card ${selectedStudentId === student._id ? 'selected' : ''}`}
            onClick={() => onStudentSelect(student)}
          >
            <div className="student-name">
              {student.firstName} {student.lastName}
            </div>
            <div className="student-email">
              {student.email}
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="empty-state">
            У вас пока нет назначенных учеников
          </div>
        )}
      </div>

      <style jsx>{`
        .teacher-students-container {
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
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .student-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
        }
        .student-card.selected {
          background: #ede9fe;
          border-color: #7c3aed;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.2);
        }
        .student-name {
          font-weight: 600;
          font-size: 16px;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .student-email {
          font-size: 14px;
          color: #64748b;
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