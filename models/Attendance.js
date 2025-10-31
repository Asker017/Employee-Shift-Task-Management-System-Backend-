const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  clockIn: { type: Date },
  clockOut: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);