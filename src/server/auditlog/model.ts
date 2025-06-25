import { Schema, model, Types } from 'mongoose';

const AuditLogSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  action: String,
  entity: String,
  entityId: Types.ObjectId,
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default model('AuditLog', AuditLogSchema); 