const Interview = require("./interviewModel");
const AdmissionApplication = require("./admissionApplicationModel");

// Get all candidates (Applications merged with Interview details)
exports.getInterviewCandidates = async (req, res) => {
    try {
        // 1. Get all applications
        const applications = await AdmissionApplication.find().sort({ createdAt: -1 });

        // 2. Get all scheduled interviews
        const interviews = await Interview.find();

        // 3. Map by applicationId
        const interviewMap = {};
        interviews.forEach(int => {
            interviewMap[int.applicationId.toString()] = int;
        });

        // 4. Merge
        const candidates = applications.map(app => {
            const interview = interviewMap[app._id.toString()];
            return {
                _id: interview ? interview._id : null,
                applicationIdRef: app._id,
                applicationId: app.applicationId,
                name: app.personalInfo?.name || "Unknown",
                guardianName: app.parents?.father?.name || app.parents?.mother?.name || "",
                mobile: app.contactInfo?.phone,
                email: app.contactInfo?.email,
                classApplied: app.earlierAcademic?.lastClass ? `Class ${app.earlierAcademic.lastClass}` : "Unknown",

                interviewDateTime: interview ? (interview.interviewDate ? new Date(interview.interviewDate).toISOString().split('T')[0] + ' ' + (interview.interviewTime || '') : "") : "",
                interviewer: interview?.interviewer || "",
                venue: interview?.venue || "",
                attendance: interview?.attendance || "Pending",
                status: interview?.status || "Pending",
                result: interview?.result || "Not Declared",
                interviewType: interview?.type || "",
            };
        });

        res.status(200).json(candidates);
    } catch (error) {
        console.error("Error fetching interview candidates:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Schedule or Update Interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { applicationIdRef, date, time, duration, teacher, venue, type, sms, whatsapp, email } = req.body;

        let interview = await Interview.findOne({ applicationId: applicationIdRef });

        if (interview) {
            interview.interviewDate = date;
            interview.interviewTime = time;
            interview.duration = duration;
            interview.interviewer = teacher;
            interview.venue = venue;
            interview.type = type;
            interview.status = "Scheduled";
            await interview.save();
        } else {
            interview = new Interview({
                applicationId: applicationIdRef,
                interviewDate: date,
                interviewTime: time,
                duration,
                interviewer: teacher,
                venue,
                type,
                status: "Scheduled"
            });
            await interview.save();
        }

        res.status(200).json({ message: "Interview scheduled successfully", interview });
    } catch (error) {
        console.error("Error scheduling interview:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Result
exports.updateInterviewResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { result, attendance } = req.body;

        const interview = await Interview.findById(id);
        if (!interview) {
            return res.status(404).json({ message: "Interview record not found. Please schedule first." });
        }

        if (result) interview.result = result;
        if (attendance) interview.attendance = attendance;

        if (attendance && attendance !== "Pending") {
            interview.status = "Completed";
        }

        await interview.save();
        res.status(200).json({ message: "Updated successfully", interview });
    } catch (error) {
        console.error("Error updating result:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.declareResult = async (req, res) => {
    try {
        const { applicationId, result, attendance } = req.body;

        let interview = await Interview.findOne({ applicationId });

        if (!interview) {
            interview = new Interview({
                applicationId,
                status: "Completed",
                result: result || "Not Declared",
                attendance: attendance || "Pending",
                interviewDate: new Date(),
                type: "Direct Entry"
            });
        } else {
            if (result) interview.result = result;
            if (attendance) interview.attendance = attendance;
            if (attendance && attendance !== "Pending") interview.status = "Completed";
            if (result && result !== "Not Declared") interview.status = "Completed";
        }

        await interview.save();
        res.status(200).json({ message: "Result updated successfully", interview });

    } catch (error) {
        console.error("Error declaring result:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
