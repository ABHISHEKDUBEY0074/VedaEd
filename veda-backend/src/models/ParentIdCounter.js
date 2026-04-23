const mongoose = require("mongoose");

const ParentIdCounterSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentIdCounter", ParentIdCounterSchema);
