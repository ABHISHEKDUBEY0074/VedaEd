const Interview = require("./interviewModel");
const AdmissionApplication = require("./admissionApplicationModel");
const EntranceExam = require("./entranceExamModel");

const isDeclaredResult = (value) =>
    value === "Qualified" || value === "Disqualified";

const resolveInterviewOutcome = ({ currentAttendance, currentResult, nextAttendance, nextResult }) => {
    const attendance = nextAttendance ?? currentAttendance ?? "Pending";
    let result = nextResult ?? currentResult ?? "Not Declared";

    // Result is only applicable when attendance is Present.
    if (attendance !== "Present") {
        result = "Not Declared";
    }

    const status =
        attendance === "Present" && isDeclaredResult(result)
            ? "Completed"
            : "Scheduled";

    return { attendance, result, status };
};

// Get all candidates (Applications merged with Interview details)
exports.getInterviewCandidates = async (req, res) => {
    try {
        // 1. Fetch only applications with a Qualified entrance result
        const qualifiedExamRecords = await EntranceExam.find(
            { result: "Qualified" },
            { applicationId: 1 }
        );
        const qualifiedApplicationIds = qualifiedExamRecords.map((exam) => exam.applicationId);

        const applications = await AdmissionApplication.find({
            _id: { $in: qualifiedApplicationIds }
        }).sort({ createdAt: -1 });

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
                classApplied: app.personalInfo?.classApplied
                    ? `Class ${app.personalInfo.classApplied}`
                    : app.earlierAcademic?.lastClass
                        ? `Class ${app.earlierAcademic.lastClass}`
                        : "Unknown",

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

        const outcome = resolveInterviewOutcome({
            currentAttendance: interview.attendance,
            currentResult: interview.result,
            nextAttendance: attendance,
            nextResult: result,
        });

        interview.attendance = outcome.attendance;
        interview.result = outcome.result;
        interview.status = outcome.status;

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

        const outcome = resolveInterviewOutcome({
            currentAttendance: interview?.attendance,
            currentResult: interview?.result,
            nextAttendance: attendance,
            nextResult: result,
        });

        if (!interview) {
            interview = new Interview({
                applicationId,
                status: outcome.status,
                result: outcome.result,
                attendance: outcome.attendance,
                interviewDate: new Date(),
                type: "Direct Entry"
            });
        } else {
            interview.result = outcome.result;
            interview.attendance = outcome.attendance;
            interview.status = outcome.status;
        }

        await interview.save();
        res.status(200).json({ message: "Result updated successfully", interview });

    } catch (error) {
        console.error("Error declaring result:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
