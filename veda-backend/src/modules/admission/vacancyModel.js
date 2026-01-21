const mongoose = require("mongoose");
const { Schema } = mongoose;

const VacancySchema = new Schema(
    {
        academicYear: { type: String, required: true },
        className: { type: String, required: true },
        totalSeats: { type: Number, required: true },
        reservedSeats: { type: Number, default: 0 },
        availableSeats: { type: Number },
        startDate: { type: String },
        endDate: { type: String },
        status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    },
    { timestamps: true }
);

VacancySchema.pre("save", function (next) {
    this.availableSeats = this.totalSeats - this.reservedSeats;
    next();
});

module.exports = mongoose.model("Vacancy", VacancySchema);
