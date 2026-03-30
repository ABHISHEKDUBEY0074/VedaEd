const { AcademicYear, FeeCategory } = require("./feeModels");

// --- Academic Year Controllers ---

exports.getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ createdAt: -1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: "Error fetching academic years", error });
  }
};

exports.createAcademicYear = async (req, res) => {
  try {
    const { label, startDate, endDate, isActive, terms } = req.body;
    
    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    const newYear = new AcademicYear({
      label,
      startDate,
      endDate,
      isActive,
      terms,
    });
    
    await newYear.save();
    res.status(201).json(newYear);
  } catch (error) {
    res.status(500).json({ message: "Error creating academic year", error });
  }
};

exports.updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, startDate, endDate, isActive, terms } = req.body;
    
    if (isActive) {
      await AcademicYear.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const updatedYear = await AcademicYear.findByIdAndUpdate(
      id,
      { label, startDate, endDate, isActive, terms },
      { new: true }
    );
    
    if (!updatedYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    res.json(updatedYear);
  } catch (error) {
    res.status(500).json({ message: "Error updating academic year", error });
  }
};

exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedYear = await AcademicYear.findByIdAndDelete(id);
    if (!deletedYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    res.json({ message: "Academic year deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting academic year", error });
  }
};

exports.activateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deactivate all
    await AcademicYear.updateMany({}, { isActive: false });
    
    // Activate the selected one
    const activatedYear = await AcademicYear.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
    
    if (!activatedYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    res.json(activatedYear);
  } catch (error) {
    res.status(500).json({ message: "Error activating academic year", error });
  }
};

// --- Fee Category Controllers ---

exports.getFeeCategories = async (req, res) => {
  try {
    const categories = await FeeCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fee categories", error });
  }
};

exports.createFeeCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const newCategory = new FeeCategory(categoryData);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating fee category", error });
  }
};

exports.updateFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const updatedCategory = await FeeCategory.findByIdAndUpdate(
      id,
      categoryData,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Fee category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating fee category", error });
  }
};

exports.deleteFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await FeeCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Fee category not found" });
    }
    res.json({ message: "Fee category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fee category", error });
  }
};

exports.toggleFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await FeeCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Fee category not found" });
    }
    category.active = !category.active;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error toggling fee category", error });
  }
};
