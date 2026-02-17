const express = require('express');
const router = express.Router();
const calendarController = require('./calendarController');

const eventTypeController = require('./eventTypeController');

// Routes for Events
router.post('/events', calendarController.createEvent);
router.get('/events', calendarController.getEvents);
// router.get('/events/:id', calendarController.getEventById); // To implement if needed
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

// Routes for Event Types
router.post('/event-types', eventTypeController.createEventType);
router.get('/event-types', eventTypeController.getEventTypes);

// Seed defaults
eventTypeController.seedDefaultTypes();

module.exports = router;
