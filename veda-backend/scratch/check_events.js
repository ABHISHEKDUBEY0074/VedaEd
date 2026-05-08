const mongoose = require('mongoose');
const CalendarEvent = require('../src/modules/calendar/calendarModel');
require('dotenv').config();

async function checkEvents() {
    try {
        await mongoose.connect('mongodb+srv://backend_user:1234567%40Revive@cluster0.4fuvc7q.mongodb.net/veda-sms'); 
        const events = await CalendarEvent.find();
        console.log(JSON.stringify(events, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkEvents();
