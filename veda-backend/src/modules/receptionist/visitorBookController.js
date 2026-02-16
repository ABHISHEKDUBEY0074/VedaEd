const VisitorBook = require('./visitorBookModel');

// Create a new visitor entry
exports.createVisitor = async (req, res) => {
    try {
        const newVisitor = new VisitorBook(req.body);
        const savedVisitor = await newVisitor.save();
        res.status(201).json({ success: true, visitor: savedVisitor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all visitors
exports.getVisitors = async (req, res) => {
    try {
        const visitors = await VisitorBook.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, visitors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a visitor entry
exports.updateVisitor = async (req, res) => {
    try {
        const updatedVisitor = await VisitorBook.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedVisitor) return res.status(404).json({ success: false, message: 'Visitor not found' });
        res.status(200).json({ success: true, visitor: updatedVisitor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a visitor entry
exports.deleteVisitor = async (req, res) => {
    try {
        const deletedVisitor = await VisitorBook.findByIdAndDelete(req.params.id);
        if (!deletedVisitor) return res.status(404).json({ success: false, message: 'Visitor not found' });
        res.status(200).json({ success: true, message: 'Visitor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
