
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Parent = require('./src/modules/parents/parentModel');
const bcrypt = require('bcryptjs');

async function reset(email, plainPassword) {
    try {
        await mongoose.connect('mongodb+srv://backend_user:1234567%40Revive@cluster0.4fuvc7q.mongodb.net/veda-sms');
        console.log(`Resetting ${email}...`);

        const hash = await bcrypt.hash(plainPassword, 10);

        // Update Parent
        const parent = await Parent.findOneAndUpdate({ email }, { password: hash }, { new: true });
        if (parent) console.log(`Updated Parent ${email} with new hash.`);

        // Update User
        const user = await User.findOneAndUpdate({ email }, { password: hash }, { new: true });
        if (user) console.log(`Updated User ${email} with new hash.`);

    } catch (err) {
        console.error(err);
    }
}

async function run() {
    await reset('bablu@gmail.com', 'password123');
    await reset('ram001@gmail.com', 'password123');
    process.exit(0);
}

run();
