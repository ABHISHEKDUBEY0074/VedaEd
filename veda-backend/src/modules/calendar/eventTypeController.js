const EventType = require('./eventTypeModel');

// Create a new event type
exports.createEventType = async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await EventType.findOne({ name });
        if (exists) {
            return res.status(400).json({ success: false, message: "Event type already exists" });
        }

        const newType = new EventType(req.body);
        const savedType = await newType.save();
        res.status(201).json({ success: true, data: savedType });
    } catch (error) {
        console.error("Error creating event type:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all event types
exports.getEventTypes = async (req, res) => {
    try {
        const types = await EventType.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: types });
    } catch (error) {
        console.error("Error fetching event types:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Seed default types if needed
exports.seedDefaultTypes = async () => {
    try {
        const count = await EventType.countDocuments();
        if (count === 0) {
            const defaults = [
                { name: "Exam", description: "Board exams and unit tests", color: "#4285f4", visibility: "Public" },
                { name: "PTM", description: "Parent teacher meetings across classes", color: "#ea4335", visibility: "Parents & Teachers" },
                { name: "Holiday", description: "School closed events and festivals", color: "#34a853", visibility: "Everyone" },
                { name: "Competition", description: "Olympiads, cultural & sports competitions", color: "#fbbc04", visibility: "Specific Groups" }
            ];
            await EventType.insertMany(defaults);
            console.log("Seeded default event types");
        }
    } catch (error) {
        console.error("Seeding event types failed:", error);
    }
};
