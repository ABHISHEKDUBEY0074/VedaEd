
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/modules/student/studentModels');
const Parent = require('./src/modules/parents/parentModel');
const Role = require('./src/models/Role');
const bcrypt = require('bcryptjs');

async function checkLogin(email, plainPassword) {
    try {
        await mongoose.connect('mongodb+srv://backend_user:1234567%40Revive@cluster0.4fuvc7q.mongodb.net/veda-sms');
        console.log("Connected to DB");

        const user = await User.findOne({ email }).populate('roleId');
        if (!user) {
            console.log(`User ${email} NOT FOUND in User collection`);
        } else {
            console.log(`User ${email} found in User collection. Role: ${user.roleId.name}`);
            const match = await bcrypt.compare(plainPassword, user.password);
            console.log(`Password match for ${email}: ${match}`);
            if (!match) {
                console.log(`Current hash in User: ${user.password}`);
            }
        }

        const student = await Student.findOne({ "personalInfo.contactDetails.email": email });
        if (student) {
            console.log(`Found as Student. Name: ${student.personalInfo.name}`);
            const sMatch = await bcrypt.compare(plainPassword, student.personalInfo.password);
             console.log(`Student collection password match: ${sMatch}`);
             console.log(`Student collection hash: ${student.personalInfo.password}`);
        }

        const parent = await Parent.findOne({ email });
        if (parent) {
            console.log(`Found as Parent. Name: ${parent.name}`);
            const pMatch = await bcrypt.compare(plainPassword, parent.password);
            console.log(`Parent collection password match: ${pMatch}`);
            console.log(`Parent collection hash: ${parent.password}`);
        }

        console.log("-------------------");
    } catch (err) {
        console.error(err);
    }
}

async function run() {
    await checkLogin('bablu@gmail.com', 'password123');
    await checkLogin('ram001@gmail.com', 'password123');
    process.exit(0);
}

run();
