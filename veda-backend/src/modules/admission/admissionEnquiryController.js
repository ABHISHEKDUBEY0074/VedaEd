const AdmissionEnquiry = require('./admissionEnquiryModel');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const newEnquiry = new AdmissionEnquiry(req.body);
        const savedEnquiry = await newEnquiry.save();
        res.status(201).json(savedEnquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all enquiries
exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await AdmissionEnquiry.find().sort({ createdAt: -1 });
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an enquiry
exports.updateEnquiry = async (req, res) => {
    try {
        const updatedEnquiry = await AdmissionEnquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEnquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.status(200).json(updatedEnquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
    try {
        const deletedEnquiry = await AdmissionEnquiry.findByIdAndDelete(req.params.id);
        if (!deletedEnquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
