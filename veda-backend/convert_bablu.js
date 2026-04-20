
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/modules/student/studentModels');
const Parent = require('./src/modules/parents/parentModel');
const Role = require('./src/models/Role');

async function convertToStudent(email) {
    try {
        await mongoose.connect('mongodb+srv://backend_user:1234567%40Revive@cluster0.4fuvc7q.mongodb.net/veda-sms');
        console.log(`Converting ${email} to student...`);

        const studentRole = await Role.findOne({ name: 'student' });
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found in User collection!");
            return;
        }

        // 1. Update User Role
        user.roleId = studentRole._id;
        
        // 2. Create Student record if not exists
        let student = await Student.findOne({ "personalInfo.contactDetails.email": email });
        if (!student) {
            student = await Student.create({
                personalInfo: {
                    name: user.name,
                    stdId: "STD-BABLU-001",
                    username: "bablu_student",
                    class: new mongoose.Types.ObjectId("68dcbc46c2e04aeb5ed779be"), // From check
                    section: new mongoose.Types.ObjectId("68c1b34a7fa6e0a4c8af3250"), // From check
                    rollNo: "1",
                    contactDetails: {
                        email: email
                    },
                    password: user.password // Keep same hashed password
                }
            });
            console.log("Created Student record.");
        }

        user.refId = student._id;
        await user.save();
        console.log("Updated User record.");

        // 3. Remove from Parent collection if there
        const res = await Parent.deleteOne({ email });
        if (res.deletedCount > 0) console.log("Removed from Parent collection.");

        console.log("Conversion complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

convertToStudent('bablu@gmail.com');
