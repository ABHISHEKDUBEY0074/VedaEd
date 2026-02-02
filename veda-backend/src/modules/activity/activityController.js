const Activity = require("./activityModel");

exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error: error.message });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        // Auto-update status based on winner presence like frontend logic, 
        // or just trust the posted status. Frontend logic: if winner.First.name exists -> Completed.
        // We can handle logic here or let frontend send it.
        // Let's rely on payload but simple check:
        if (newActivity.winner?.First?.name) {
            newActivity.status = "Completed";
        }

        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: "Error creating activity", error: error.message });
    }
};

exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Logic to update status if winners are added
        if (updates.winner?.First?.name) {
            updates.status = "Completed";
        }

        const updatedActivity = await Activity.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedActivity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: "Error updating activity", error: error.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedActivity = await Activity.findByIdAndDelete(id);

        if (!deletedActivity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting activity", error: error.message });
    }
};
