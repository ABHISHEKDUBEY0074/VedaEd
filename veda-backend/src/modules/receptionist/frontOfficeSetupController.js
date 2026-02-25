const FrontOfficeSetup = require('./frontOfficeSetupModel');

exports.getSetups = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const setups = await FrontOfficeSetup.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: setups });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createSetup = async (req, res) => {
    try {
        const { type, name, description } = req.body;
        const newSetup = new FrontOfficeSetup({ type, name, description });
        await newSetup.save();
        res.status(201).json({ success: true, data: newSetup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedSetup = await FrontOfficeSetup.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );
        if (!updatedSetup) {
            return res.status(404).json({ success: false, message: 'Setup not found' });
        }
        res.status(200).json({ success: true, data: updatedSetup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSetup = await FrontOfficeSetup.findByIdAndDelete(id);
        if (!deletedSetup) {
            return res.status(404).json({ success: false, message: 'Setup not found' });
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
