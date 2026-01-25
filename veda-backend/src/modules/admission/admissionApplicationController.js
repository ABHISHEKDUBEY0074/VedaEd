const AdmissionApplication = require("./admissionApplicationModel");
const EntranceExam = require("./entranceExamModel");
const Interview = require("./interviewModel");
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

// Track Application Status
exports.trackApplication = async (req, res) => {
    try {
        const { id } = req.params; // Expecting applicationId (e.g. APP-123) OR _id

        let query = { applicationId: id };

        // Check if input might be a MongoDB _id (24 hex chars)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // It's a valid ObjectId format, verify if it finds anything, OR search applicationId
            // We can use $or to be safe
            query = { $or: [{ applicationId: id }, { _id: id }] };
        }

        const application = await AdmissionApplication.findOne(query);

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const entranceExam = await EntranceExam.findOne({ applicationId: application._id });
        const interview = await Interview.findOne({ applicationId: application._id });

        // Construct steps
        const steps = [];

        // 1. Admission Form - Always completed if application exists
        steps.push({
            label: "Admission Form",
            status: "completed",
            details: "Detailed application form submitted successfully.",
        });

        // 2. Application Listed/Review
        steps.push({
            label: "Application Listed",
            status: "completed", // Assuming listed if it exists
            details: "Application is under review by admin.",
        });

        // 3. Document Verification
        let docStatus = "pending";
        let docDetails = "Documents are pending verification.";
        const docVerStatus = (application.documentVerificationStatus || "").toLowerCase();

        if (docVerStatus === "verified") {
            docStatus = "completed";
            docDetails = "All documents verified successfully.";
        } else if (docVerStatus === "rejected") {
            docStatus = "pending"; // Or error/rejected
            docDetails = "Some documents were rejected. Please re-upload.";
        }

        steps.push({
            label: "Document Verification",
            status: docStatus,
            details: docDetails,
        });

        // 4. Entrance Exam (Optional/Conditional) - Show if exists
        if (entranceExam) {
            let examStatus = "pending";
            let examDetails = "Exam schedule pending.";

            if (entranceExam.status === "Completed" && entranceExam.result === "Qualified") {
                examStatus = "completed";
                examDetails = `Exam Qualified. Marks/Grade: ${entranceExam.result}`;
            } else if (entranceExam.status === "Completed" && entranceExam.result === "Disqualified") {
                examStatus = "pending";
                examDetails = "Exam Disqualified.";
            } else if (entranceExam.status === "Scheduled") {
                examStatus = "pending";
                examDetails = `Scheduled on ${new Date(entranceExam.examDate).toLocaleDateString()} at ${entranceExam.time || 'TBD'}`;
            }

            steps.push({
                label: "Entrance Exam",
                status: examStatus,
                details: examDetails,
            });
        }

        // 5. Interview
        if (interview) {
            let intStatus = "pending";
            let intDetails = "Interview schedule pending.";

            if (interview.status === "Completed" && interview.result === "Qualified") {
                intStatus = "completed";
                intDetails = "Interview Qualified.";
            } else if (interview.status === "Scheduled") {
                intStatus = "pending";
                intDetails = `Scheduled on ${new Date(interview.interviewDate).toLocaleDateString()}`;
            }

            steps.push({
                label: "Interview",
                status: intStatus,
                details: intDetails,
            });
        }

        // 6. Final Status / Offer
        let offerStatus = "upcoming";
        let offerDetails = "Pending final decision.";

        if (application.applicationStatus === "Approved") {
            offerStatus = "completed";
            offerDetails = "Application Approved. Offer Letter Generated.";
        } else if (application.applicationStatus === "Rejected") {
            offerStatus = "upcoming";
            offerDetails = "Application Rejected.";
        }

        steps.push({
            label: "Application Result",
            status: offerStatus,
            details: offerDetails,
        });

        // 7. Fees (Simple logic for now)
        steps.push({
            label: "Fees Confirmation",
            status: application.personalInfo?.fees === 'Paid' ? "completed" : "upcoming",
            details: application.personalInfo?.fees === 'Paid' ? "Fees Paid." : "Fees Payment Pending.",
        });


        const result = {
            applicationId: application.applicationId,
            studentName: application.personalInfo?.name,
            classApplied: application.earlierAcademic?.lastClass,
            academicYear: application.earlierAcademic?.academicYear || "2025-26",
            steps: steps,
        };

        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("Error tracking application:", error);
        res.status(500).json({
            success: false,
            message: "Failed to track application",
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
