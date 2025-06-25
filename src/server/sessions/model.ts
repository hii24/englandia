import { Schema, model, Types } from 'mongoose';

const AttendeeSchema = new Schema({
  studentId: { type: Types.ObjectId, ref: 'User' },
  isPresent: Boolean,
  completedAt: Date,
}, { _id: false });

const LessonSessionSchema = new Schema({
  lessonId: { type: Types.ObjectId, ref: 'Lesson' },
  teacherId: { type: Types.ObjectId, ref: 'User' },
  scheduledDate: Date,
  meetingLink: String,
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  attendees: [AttendeeSchema],
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

export default model('LessonSession', LessonSessionSchema); 