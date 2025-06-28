// Общий модуль для хранения расписаний
// Используется в API endpoints для синхронизации данных

import mongoose, { Schema, model, models } from 'mongoose';

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

// Mongoose схемы
const DayScheduleSchema = new Schema<DaySchedule>({
  day: { type: String, required: true },
  time: { type: String, required: true },
  enabled: { type: Boolean, required: true }
}, { _id: false });

const TeacherScheduleSchema = new Schema<TeacherSchedule>({
  teacherId: { type: String, required: true },
  studentId: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  daysSchedule: { type: [DayScheduleSchema], required: true },
  timezone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LessonScheduleSchema = new Schema<LessonSchedule>({
  lessonId: { type: String, required: true },
  studentId: { type: String, required: true },
  teacherId: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  time: { type: String, required: true },
  timezone: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TeacherScheduleModel = models.TeacherSchedule || model('TeacherSchedule', TeacherScheduleSchema);
export const LessonScheduleModel = models.LessonSchedule || model('LessonSchedule', LessonScheduleSchema);

// --- Функции для работы с MongoDB ---

export async function findTeacherSchedule(teacherId: string, studentId: string) {
  return TeacherScheduleModel.findOne({ teacherId, studentId }).lean();
}

export async function saveTeacherSchedule(schedule: TeacherSchedule) {
  const existing = await TeacherScheduleModel.findOne({ teacherId: schedule.teacherId, studentId: schedule.studentId });
  if (existing) {
    await TeacherScheduleModel.updateOne(
      { teacherId: schedule.teacherId, studentId: schedule.studentId },
      { ...schedule, updatedAt: new Date() }
    );
  } else {
    await TeacherScheduleModel.create(schedule);
  }
}

export async function findLessonSchedule(lessonId: string, studentId: string, teacherId: string) {
  return LessonScheduleModel.findOne({ lessonId, studentId, teacherId }).lean();
}

export async function saveLessonSchedule(schedule: LessonSchedule) {
  const existing = await LessonScheduleModel.findOne({ lessonId: schedule.lessonId, studentId: schedule.studentId, teacherId: schedule.teacherId });
  if (existing) {
    await LessonScheduleModel.updateOne(
      { lessonId: schedule.lessonId, studentId: schedule.studentId, teacherId: schedule.teacherId },
      { ...schedule, updatedAt: new Date() }
    );
  } else {
    await LessonScheduleModel.create(schedule);
  }
}

export async function findLessonSchedulesByStudent(studentId: string, teacherId: string) {
  return LessonScheduleModel.find({ studentId, teacherId }).lean();
}

export async function getStorageStatus() {
  const teacherSchedules = await TeacherScheduleModel.find().lean();
  const lessonSchedules = await LessonScheduleModel.find().lean();
  return {
    teacherSchedulesCount: teacherSchedules.length,
    lessonSchedulesCount: lessonSchedules.length,
    teacherSchedules,
    lessonSchedules
  };
}

export async function clearStorage() {
  await TeacherScheduleModel.deleteMany({});
  await LessonScheduleModel.deleteMany({});
} 