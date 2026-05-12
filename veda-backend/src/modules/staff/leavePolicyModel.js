const mongoose = require("mongoose");

const leavePolicySchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "default" },
    paidLeaveLimit: { type: Number, default: 15, min: 0 },
    maxLeaveLimit: { type: Number, default: 20, min: 0 },
    leaveCycle: { type: String, enum: ["Yearly"], default: "Yearly" },
    cycleStartMonth: { type: Number, default: 1, min: 1, max: 12 },
    minLeavePerRequest: { type: Number, default: 0.5, min: 0.5 },
    maxLeavePerRequest: { type: Number, default: 10, min: 0.5 },
    allowHalfDay: { type: Boolean, default: true },
    excludeSundays: { type: Boolean, default: true },
    excludeHolidays: { type: Boolean, default: true },
    autoConvertExtraToUnpaid: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeavePolicy", leavePolicySchema);
