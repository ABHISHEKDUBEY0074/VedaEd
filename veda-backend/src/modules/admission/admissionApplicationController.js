const AdmissionApplication = require("./admissionApplicationModel");
const path = require("path");
const fs = require("fs");

// Create a new admission application
exports.createApplication = async (req, res) => {
    try {
        console.log("Received application data:", JSON.stringify(req.body, null, 2));
        const applicationData = req.body;

        // Create new application
        const newApplication = new AdmissionApplication(applicationData);
        await newApplication.save();

        res.status(201).json({
            success: true,
            data: newApplication,
            message: "Application submitted successfully",
        });
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit application: " + error.message,
            error: error.message,
        });
    }
};

// Upload documents for an application
exports.uploadApplicationDocument = async (req, res) => {
    try {
        console.log("Upload request received. Body:", req.body);
        console.log("Upload request file:", req.file);

        const applicationId = req.body.applicationId || req.params.id;

        if (!req.file) {
            console.error("No file in request");
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        if (!applicationId) {
            console.error("No applicationId in request");
            return res.status(400).json({ success: false, message: "No applicationId provided" });
        }

        const application = await AdmissionApplication.findById(applicationId);
        if (!application) {
            console.error("Application not found for ID:", applicationId);
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const docData = {
            name: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            fileType: req.file.mimetype,
        };

        if (req.body.type) {
            docData.type = req.body.type;
        }

        application.documents.push(docData);
        await application.save();
        console.log("Document saved successfully to application:", applicationId);

        res.status(200).json({
            success: true,
            message: "Document uploaded successfully",
            data: application,
        });
    } catch (error) {
        console.error("Error uploading document:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload document",
            error: error.message,
        });
    }
};

// Get all applications (for the 'Application Approval' list)
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await AdmissionApplication.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
            error: error.message,
        });
    }
};

// Get single application
exports.getApplicationById = async (req, res) => {
    try {
        const application = await AdmissionApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }
        res.status(200).json({
            success: true,
            data: application,
            message: "Application fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch application",
            error: error.message,
        });
    }
};

// Get Selected Students (Verified Documents)
exports.getSelectedStudents = async (req, res) => {
    try {
        const applications = await AdmissionApplication.find({
            documentVerificationStatus: { $in: ["Verified", "verified"] }
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch selected students",
            error: error.message,
        });
    }
};

// Update full application details
exports.updateApplication = async (req, res) => {
    try {
        const updates = req.body;

        // Remove internal fields that shouldn't be updated manually
        delete updates._id;
        delete updates.__v;
        delete updates.createdAt;
        delete updates.updatedAt;

        const application = await AdmissionApplication.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.status(200).json({
            success: true,
            data: application,
            message: "Application updated successfully",
        });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update application",
            error: error.message,
        });
    }
};

// Update application status (Approve/Reject)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const application = await AdmissionApplication.findByIdAndUpdate(
            req.params.id,
            { applicationStatus: status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.status(200).json({
            success: true,
            data: application,
            message: `Application ${status}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: error.message,
        });
    }
};

// Delete a document
exports.deleteApplicationDocument = async (req, res) => {
    try {
        const { id, documentId } = req.params;

        const application = await AdmissionApplication.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Filter out the document to delete
        // Assuming documents is an array of objects with _id
        const docIndex = application.documents.findIndex(d => d._id.toString() === documentId);

        if (docIndex === -1) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        // Optional: Delete file from filesystem if needed
        // const docPath = application.documents[docIndex].path;
        // if (fs.existsSync(docPath)) fs.unlinkSync(docPath);

        application.documents.splice(docIndex, 1);
        await application.save();

        res.status(200).json({
            success: true,
            message: "Document deleted successfully",
            data: application
        });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete document",
            error: error.message
        });
    }
};

// Verify/Reject a specific document
exports.verifyDocumentStatus = async (req, res) => {
    try {
        const { applicationId, documentId } = req.params;
        const { status, comment } = req.body;

        const application = await AdmissionApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Find document subdocument
        const document = application.documents.id(documentId);
        if (!document) {
            // Fallback: match by _id string
            const docIndex = application.documents.findIndex(d => d._id.toString() === documentId);
            if (docIndex === -1) {
                return res.status(404).json({ success: false, message: "Document not found" });
            }
            application.documents[docIndex].verificationStatus = status;
            application.documents[docIndex].comment = comment;
            application.documents[docIndex].verifiedAt = new Date();
        } else {
            document.set({ verificationStatus: status, comment: comment, verifiedAt: new Date() });
        }

        // CHECK IF ALL DOCUMENTS ARE VERIFIED
        const allVerified = application.documents.length > 0 && application.documents.every(doc => (doc.verificationStatus || '').toLowerCase() === 'verified');
        const anyRejected = application.documents.some(doc => (doc.verificationStatus || '').toLowerCase() === 'rejected');

        if (allVerified) {
            application.documentVerificationStatus = 'Verified';
        } else if (anyRejected) {
            application.documentVerificationStatus = 'Rejected';
        } else {
            application.documentVerificationStatus = 'Pending';
        }

        await application.save();

        res.status(200).json({
            success: true,
            message: "Document status updated",
            data: application
        });
    } catch (error) {
        console.error("Error verifying document:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify document",
            error: error.message
        });
    }
};
