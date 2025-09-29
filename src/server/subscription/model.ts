import { Schema, model, Types, models } from 'mongoose';

const SubscriptionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  autoRenewal: { type: Boolean, default: true },
  paymentMethod: String,
  lessonsPerMonth: { type: Number, required: true }, // 8, 24 или 48
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Используем паттерн singleton для избежания ошибки перезаписи модели
const Subscription = models.Subscription || model('Subscription', SubscriptionSchema);

export default Subscription; 