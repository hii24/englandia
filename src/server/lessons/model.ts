import { Schema, model, Types } from 'mongoose';

const MaterialSchema = new Schema({
  title: String,
  url: String,
  type: { type: String, enum: ['link', 'file'], default: 'link' },
  forStudent: { type: Boolean, default: false }
}, { _id: false });

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  orderNumber: { type: Number, required: true, unique: true },
  videoUrl: String,
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
}, { timestamps: true });

export default model('Lesson', LessonSchema); 