const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, enum: ['admin', 'teacher', 'parent', 'staff', 'student', 'hr', 'receptionist', 'admission'] }
});

module.exports = mongoose.model('Role', roleSchema);
