// Общий модуль для хранения расписаний
// Используется в API endpoints для синхронизации данных

export interface DaySchedule {
  day: string;
  time: string;
  enabled: boolean;
}

export interface TeacherSchedule {
  teacherId: string;
  studentId: string;
  enabled: boolean;
  daysSchedule: DaySchedule[];
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonSchedule {
  lessonId: string;
  studentId: string;
  teacherId: string;
  scheduledDate: string;
  time: string;
  timezone: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Временное хранилище расписаний учителей
export const teacherSchedules: TeacherSchedule[] = [];

// Временное хранилище расписаний уроков
export const lessonSchedules: LessonSchedule[] = [];

// Функции для работы с расписаниями учителей
export const findTeacherSchedule = (teacherId: string, studentId: string): TeacherSchedule | undefined => {
  console.log('🔍 findTeacherSchedule called with:', { teacherId, studentId });
  console.log('📊 Current teacherSchedules:', teacherSchedules);
  
  const schedule = teacherSchedules.find(s => s.teacherId === teacherId && s.studentId === studentId);
  console.log('✅ Found schedule:', schedule);
  
  return schedule;
};

export const saveTeacherSchedule = (schedule: TeacherSchedule): void => {
  console.log('💾 saveTeacherSchedule called with:', schedule);
  
  const existingIndex = teacherSchedules.findIndex(s => 
    s.teacherId === schedule.teacherId && s.studentId === schedule.studentId
  );

  if (existingIndex >= 0) {
    teacherSchedules[existingIndex] = {
      ...teacherSchedules[existingIndex],
      ...schedule,
      updatedAt: new Date()
    };
    console.log('🔄 Updated existing schedule at index:', existingIndex);
  } else {
    teacherSchedules.push(schedule);
    console.log('➕ Added new schedule, total count:', teacherSchedules.length);
  }
  
  console.log('📊 Current teacherSchedules after save:', teacherSchedules);
};

// Функции для работы с расписаниями уроков
export const findLessonSchedule = (lessonId: string, studentId: string, teacherId: string): LessonSchedule | undefined => {
  return lessonSchedules.find(s => 
    s.lessonId === lessonId && s.studentId === studentId && s.teacherId === teacherId
  );
};

export const saveLessonSchedule = (schedule: LessonSchedule): void => {
  const existingIndex = lessonSchedules.findIndex(s => 
    s.lessonId === schedule.lessonId && 
    s.studentId === schedule.studentId && 
    s.teacherId === schedule.teacherId
  );

  if (existingIndex >= 0) {
    lessonSchedules[existingIndex] = schedule;
  } else {
    lessonSchedules.push(schedule);
  }
};

export const findLessonSchedulesByStudent = (studentId: string, teacherId: string): LessonSchedule[] => {
  return lessonSchedules.filter(s => s.studentId === studentId && s.teacherId === teacherId);
};

// Диагностические функции
export const getStorageStatus = () => {
  return {
    teacherSchedulesCount: teacherSchedules.length,
    lessonSchedulesCount: lessonSchedules.length,
    teacherSchedules: teacherSchedules,
    lessonSchedules: lessonSchedules
  };
};

export const clearStorage = () => {
  teacherSchedules.length = 0;
  lessonSchedules.length = 0;
  console.log('🗑️ Storage cleared');
}; 