import { Schema, model, Types } from 'mongoose';

const NoteSchema = new Schema({
  note: String,
  authorId: { type: Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const StudentProgressSchema = new Schema({
  studentId: { type: Types.ObjectId, ref: 'User' },
  lessonId: { type: Types.ObjectId, ref: 'Lesson' },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  completedAt: Date,
  sessionsAttended: { type: Number, default: 0 },
  attendedSessionIds: [{ type: Types.ObjectId, ref: 'LessonSession' }],
  teacherNotes: [NoteSchema],
}, { timestamps: true });

export default model('StudentProgress', StudentProgressSchema); 