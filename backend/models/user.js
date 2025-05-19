const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  try {
    console.log('Pre-save hook triggered for user:', this.email);
    if (this.isModified('password')) {
      console.log('Password modified, hashing password');
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);