const Discipline = require("./disciplineModels");

// Create a new incident
exports.createIncident = async (req, res) => {
    try {
        const incident = new Discipline(req.body);
        const savedIncident = await incident.save();
        res.status(201).json(savedIncident);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all incidents
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await Discipline.find().sort({ createdAt: -1 });
        res.status(200).json(incidents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get incident by ID
exports.getIncidentById = async (req, res) => {
    try {
        const incident = await Discipline.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: "Incident not found" });
        res.status(200).json(incident);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update incident
exports.updateIncident = async (req, res) => {
    try {
        const updatedIncident = await Discipline.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedIncident) return res.status(404).json({ message: "Incident not found" });
        res.status(200).json(updatedIncident);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete incident
exports.deleteIncident = async (req, res) => {
    try {
        const deletedIncident = await Discipline.findByIdAndDelete(req.params.id);
        if (!deletedIncident) return res.status(404).json({ message: "Incident not found" });
        res.status(200).json({ message: "Incident deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
