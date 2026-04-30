const mongoose = require('mongoose');
const Parent = require('./src/modules/parents/parentModel');
const Student = require('./src/modules/student/studentModels');
const User = require('./src/models/User');

mongoose.connect('mongodb://127.0.0.1:27017/VedaEd', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    
    // Find parent user by name
    const parentUsers = await User.find({ name: /suhani/i });
    console.log('Found Users:', parentUsers);
    
    // Find parent in Parent collection
    const parents = await Parent.find({ name: /suhani/i }).populate('children');
    console.log('Found Parents in Parent collection:', JSON.stringify(parents, null, 2));

    // Find student manpreet
    const students = await Student.find({ 'personalInfo.name': /manpreet/i }).populate('personalInfo.class personalInfo.section');
    console.log('Found Students:', JSON.stringify(students, null, 2));

    process.exit(0);
  });
