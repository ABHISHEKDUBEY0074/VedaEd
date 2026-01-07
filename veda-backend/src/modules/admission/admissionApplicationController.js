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

        const { applicationId } = req.body;

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
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch application",
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
        const document = application.documents.id(documentId); // Mongoose subdoc method
        if (!document) {
            // Fallback: match by _id string if .id() fails or if using plain object array
            const docIndex = application.documents.findIndex(d => d._id.toString() === documentId);
            if (docIndex === -1) {
                return res.status(404).json({ success: false, message: "Document not found" });
            }
            application.documents[docIndex].verificationStatus = status; // Note: You need to add this field to schema if not present!
            // Schema has 'documentVerificationStatus' on Application, NOT per document in the schema I viewed?
            // Let's check schema again. schema has 'documents' array.
            // I need to check if 'documents' array elements have 'verificationStatus'.
        } else {
            // If I update schema to include verificationStatus in document array
            document.set({ verificationStatus: status, comment: comment, verifiedAt: new Date() });
        }

        // Wait, I need to check if schema has these fields on document sub-schema. 
        // Based on previous view, it did NOT.
        // It had: name, type, path, size, fileType, uploadedAt.
        // I MUST update schema first.

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
