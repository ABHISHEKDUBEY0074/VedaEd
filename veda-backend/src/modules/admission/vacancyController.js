const Vacancy = require("./vacancyModel");

exports.createVacancy = async (req, res) => {
    try {
        const newVacancy = new Vacancy(req.body);
        await newVacancy.save();
        res.status(201).json({ success: true, data: newVacancy, message: "Vacancy created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllVacancies = async (req, res) => {
    try {
        const vacancies = await Vacancy.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: vacancies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vacancy) return res.status(404).json({ success: false, message: "Vacancy not found" });
        res.status(200).json({ success: true, data: vacancy, message: "Vacancy updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
        if (!vacancy) return res.status(404).json({ success: false, message: "Vacancy not found" });
        res.status(200).json({ success: true, message: "Vacancy deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
