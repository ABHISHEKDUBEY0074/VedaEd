const mongoose = require('mongoose');

const teacherClassSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('TeacherClass', teacherClassSchema);
