import mongoose from 'mongoose';

const apiTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false }
});

export const ApiToken = mongoose.model('ApiToken', apiTokenSchema);