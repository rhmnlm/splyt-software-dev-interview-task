import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: { type: String },
});

export const User = mongoose.model('User', userSchema);