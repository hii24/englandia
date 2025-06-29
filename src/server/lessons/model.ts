import { Schema, model, Types, models } from 'mongoose';

const MaterialSchema = new Schema({
  title: String,
  url: String,
  type: { type: String, enum: ['link', 'file'], default: 'link' },
  forStudent: { type: Boolean, default: false },
  createdBy: { type: Types.ObjectId, ref: 'User' }
}, { _id: false });

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  orderNumber: { type: Number, required: true, unique: true },
  videoUrl: String,
  bunnyVideoId: String,
  materials: [MaterialSchema],
  additionalMaterials: [MaterialSchema],
  homework: [MaterialSchema],
  lessonLink: {
    title: String,
    url: String,
    forStudent: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  teacherId: { type: Types.ObjectId, ref: 'User' },
  scheduledDate: Date,
  scheduleEnabled: { type: Boolean, default: false },
  schedulePattern: { type: String, enum: ['4_per_month', '8_per_month'], default: '4_per_month' },
}, { timestamps: true });

// Используем паттерн singleton для избежания ошибки перезаписи модели
const Lesson = models.Lesson || model('Lesson', LessonSchema);

export default Lesson; 