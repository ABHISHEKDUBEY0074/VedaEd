const Institution = require("./institutionModel");

// Get institution setup data
exports.getInstitution = async (req, res) => {
    try {
        const institution = await Institution.findOne();
        if (!institution) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "No institution setup found",
            });
        }
        res.status(200).json({
            success: true,
            data: institution,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch institution data",
            error: error.message,
        });
    }
};

// Update or create institution setup
exports.updateInstitution = async (req, res) => {
    try {
        const updateData = req.body;

        // Check if institution already exists
        let institution = await Institution.findOne();

        if (institution) {
            // Update existing
            institution = await Institution.findByIdAndUpdate(
                institution._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        } else {
            // Create new
            institution = new Institution(updateData);
            await institution.save();
        }

        res.status(200).json({
            success: true,
            data: institution,
            message: "Institution setup saved successfully",
        });
    } catch (error) {
        console.error("Error updating institution:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save institution setup",
            error: error.message,
        });
    }
};

// Handle file uploads (Logo and Cover Image)
exports.uploadInstitutionAssets = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const institution = await Institution.findOne();
        if (!institution) {
            // If no institution, we might need to create a skeleton one or 
            // return an error if we expect creation via updateInstitution first.
            // For simplicity, let's just return error for now.
            return res.status(404).json({ success: false, message: "Please save basic details first" });
        }

        const updateFields = {};
        if (req.files.logo) {
            updateFields["branding.logo"] = req.files.logo[0].filename;
        }
        if (req.files.coverImage) {
            updateFields["branding.coverImage"] = req.files.coverImage[0].filename;
        }

        const updatedInstitution = await Institution.findByIdAndUpdate(
            institution._id,
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedInstitution,
            message: "Assets uploaded successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload assets",
            error: error.message,
        });
    }
};
