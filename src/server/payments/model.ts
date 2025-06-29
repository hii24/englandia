import { Schema, model, models, Types } from 'mongoose';

const PaymentSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  stripeSessionId: { type: String },
  amount: { type: Number },
  currency: { type: String },
  status: { type: String },
  eventType: { type: String },
  rawEvent: { type: Object },
}, { timestamps: true });

export const Payment = models.Payment || model('Payment', PaymentSchema); 