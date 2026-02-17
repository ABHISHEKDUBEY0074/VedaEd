const CalendarEvent = require('./calendarModel');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new CalendarEvent(req.body);
        // TODO: Associate with logged-in user if auth is available
        // newEvent.createdBy = req.user.id; 

        const savedEvent = await newEvent.save();
        res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
        console.error("Error creating calendar event:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all events (can filter by date range later)
exports.getEvents = async (req, res) => {
    try {
        const { start, end } = req.query;
        let query = {};

        if (start && end) {
            query = {
                $or: [
                    { startDate: { $gte: new Date(start), $lte: new Date(end) } },
                    { endDate: { $gte: new Date(start), $lte: new Date(end) } },
                    {
                        $and: [
                            { startDate: { $lte: new Date(start) } },
                            { endDate: { $gte: new Date(end) } }
                        ]
                    }
                ]
            };
        }

        const events = await CalendarEvent.find(query).sort({ startDate: 1 });
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await CalendarEvent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        console.error("Error updating calendar event:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await CalendarEvent.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting calendar event:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
