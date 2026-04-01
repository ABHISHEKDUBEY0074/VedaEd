const { AcademicYear, FeeCategory, GradeFee, InstallmentPlan } = require("./feeModels");

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
// --- Grade Fee Controllers ---

exports.getGradeFees = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }
    let fees = await GradeFee.find({ year });
    if (fees.length === 0) {
      const defaultGrades = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
      fees = defaultGrades.map(grade => ({
        year, grade, tuition: 0, transport: 0, lab: 0, library: 0, sports: 0, exam: 0, development: 0
      }));
    }
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grade fees", error });
  }
};

exports.updateGradeFee = async (req, res) => {
  try {
    const { year, grade, field, value } = req.body;
    let feeDoc = await GradeFee.findOne({ year, grade });
    
    if (!feeDoc) {
      // Create new if it doesn't exist
      feeDoc = new GradeFee({ year, grade });
    }
    
    feeDoc[field] = value;
    await feeDoc.save();
    
    res.json(feeDoc);
  } catch (error) {
    res.status(500).json({ message: "Error updating grade fee", error });
  }
};

// --- Installment Plan Controllers ---

exports.getInstallmentPlans = async (req, res) => {
  try {
    const plans = await InstallmentPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching installment plans", error });
  }
};

exports.createInstallmentPlan = async (req, res) => {
  try {
    const planData = req.body;
    const newPlan = new InstallmentPlan(planData);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: "Error creating installment plan", error });
  }
};

exports.updateInstallmentPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const planData = req.body;
    const updatedPlan = await InstallmentPlan.findByIdAndUpdate(
      id,
      planData,
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: "Installment plan not found" });
    }
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "Error updating installment plan", error });
  }
};

exports.deleteInstallmentPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await InstallmentPlan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Installment plan not found" });
    }
    res.json({ message: "Installment plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting installment plan", error });
  }
};
