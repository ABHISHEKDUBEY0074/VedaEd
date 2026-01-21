const EntranceExam = require("./entranceExamModel");
const AdmissionApplication = require("./admissionApplicationModel");

// Get all candidates (Applications merged with Exam details)
exports.getEntranceCandidates = async (req, res) => {
    try {
        // 1. Get all applications
        // You might want to filter by status if needed, e.g., only "Pending" or "Document Verified" applications
        const applications = await AdmissionApplication.find().sort({ createdAt: -1 });

        // 2. Get all scheduled exams
        const exams = await EntranceExam.find();

        // 3. Map exams by applicationId for easy lookup
        const examMap = {};
        exams.forEach(exam => {
            examMap[exam.applicationId.toString()] = exam;
        });

        // 4. Merge data
        const candidates = applications.map(app => {
            const exam = examMap[app._id.toString()];
            return {
                _id: exam ? exam._id : null, // Exam ID if exists
                applicationIdRef: app._id,
                applicationId: app.applicationId, // The readable ID (e.g., APP-2026-001)
                name: app.personalInfo?.name || "Unknown",
                guardianName: app.parents?.father?.name || app.parents?.mother?.name || app.parents?.guardian?.name || "",
                mobile: app.contactInfo?.phone,
                email: app.contactInfo?.email,
                classApplied: app.earlierAcademic?.lastClass ? `Class ${app.earlierAcademic.lastClass}` : "Unknown", // Adjust logic if classApplied is stored differently
                // If we don't have exact 'classApplied' in Application, we might need to rely on what was submitted.
                // Looking at AdmissionApplicationModel, there isn't a direct 'classApplied' field at top level, 
                // but often it's in 'earlierAcademic.lastClass' or implied. 
                // For now, let's assume we might need to add 'classApplied' to AdmissionApplication or infer it.
                // Actually, let's check AdmissionForm frontend or model again if needed. 
                // For now I will use a placeholder or derived value.

                entranceDateTime: exam ? (exam.examDate ? new Date(exam.examDate).toISOString().split('T')[0] + ' ' + (exam.examTime || '') : "") : "",
                examiner: exam?.examiner || "",
                venue: exam?.venue || "",
                attendance: exam?.attendance || "Pending",
                status: exam?.status || "Pending",
                result: exam?.result || "Not Declared",
                examType: exam?.type || "",
            };
        });

        res.status(200).json(candidates);
    } catch (error) {
        console.error("Error fetching entrance candidates:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Schedule or Update Exam
exports.scheduleEntranceExam = async (req, res) => {
    try {
        const { applicationIdRef, date, time, duration, examiner, venue, type, sms, whatsapp, email } = req.body;

        // Check if exam exists
        let exam = await EntranceExam.findOne({ applicationId: applicationIdRef });

        if (exam) {
            // Update
            exam.examDate = date;
            exam.examTime = time;
            exam.duration = duration;
            exam.examiner = examiner;
            exam.venue = venue;
            exam.type = type;
            exam.status = "Scheduled";
            await exam.save();
        } else {
            // Create
            exam = new EntranceExam({
                applicationId: applicationIdRef,
                examDate: date,
                examTime: time,
                duration,
                examiner,
                venue,
                type,
                status: "Scheduled"
            });
            await exam.save();
        }

        // TODO: Send Notifications (SMS, WhatsApp, Email) based on flags

        res.status(200).json({ message: "Entrance exam scheduled successfully", exam });
    } catch (error) {
        console.error("Error scheduling exam:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Result/Attendance
exports.updateEntranceResult = async (req, res) => {
    try {
        const { id } = req.params; // Entrance Exam ID (if we have it) or Application ID?
        // Safer to use Entrance Exam ID if we are editing an arbitrary row that has an ID. 
        // But rows without schedule don't have Exam ID.
        // Let's accept applicationIdRef as primary key if ID is missing.

        // Actually the frontend sends 'id' which might be our constructed ID.
        // If it's a new record (no exam yet), we can't update result usually (must schedule first).
        // But if we want to allow updating result directly, we need to treat it carefully.

        // For now assuming we update by Exam ID.
        const { result, attendance } = req.body;

        const exam = await EntranceExam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: "Exam record not found. Please schedule first." });
        }

        if (result) exam.result = result;
        if (attendance) exam.attendance = attendance;

        if (result || attendance) {
            // If attendance is marked Present/Absent, update status?
            if (attendance && attendance !== "Pending") {
                exam.status = "Completed";
            }
        }

        await exam.save();
        res.status(200).json({ message: "Updated successfully", exam });
    } catch (error) {
        console.error("Error updating result:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.declareResult = async (req, res) => {
    try {
        const { applicationId, result, attendance } = req.body;

        // Find by applicationId string (which is stored in 'applicationId' field in schema? 
        // No, 'applicationId' in schema is the Ref ObjectId usually? 
        // Let's check schema/previous code.
        // In getEntranceCandidates: `applicationIdRef: app._id` and `applicationId: app.applicationId` (string).
        // schema uses `applicationId` as Ref/ObjectId usually?
        // Checking scheduleEntranceExam: `findOne({ applicationId: applicationIdRef })`
        // So `applicationId` in Schema is the ObjectId ref to Application.
        // The frontend sends `applicationId: student.applicationIdRef` to `declareResult`.
        // So we should search by `applicationId: applicationId`.

        let exam = await EntranceExam.findOne({ applicationId });

        if (!exam) {
            exam = new EntranceExam({
                applicationId,
                status: "Completed",
                result: result || "Not Declared",
                attendance: attendance || "Pending",
                examDate: new Date(),
                type: "Direct Entry"
            });
        } else {
            if (result) exam.result = result;
            if (attendance) exam.attendance = attendance;
            if (attendance && attendance !== "Pending") exam.status = "Completed";
            if (result && result !== "Not Declared") exam.status = "Completed";
        }

        await exam.save();
        res.status(200).json({ message: "Result updated successfully", exam });

    } catch (error) {
        console.error("Error declaring result:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
