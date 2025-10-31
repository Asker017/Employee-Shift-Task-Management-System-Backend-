const mongoose = require("mongoose");

const shiftAssignmentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shift: { 
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("shiftAssignmentSchema", shiftAssignmentSchema)