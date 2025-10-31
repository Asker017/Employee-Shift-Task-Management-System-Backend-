const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User")
const Attendance = require("../models/Attendance")
const Task = require("../models/Task")

const router = express.Router();

// GET PROFILE DETAILS
router.get("/profile/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
    .select("name email department designation role")
    .lean()
    if(!employee) return res.status(404).json({ message: "Employee not found" })

    return res.json({ employee })
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile details" })
  }
})

// CLOCK IN
router.post("/attendance/clock-in", authMiddleware, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: new Date().setHours(0, 0, 0, 0) }
    })

    if (existing) return res.status(400).json({ message: "Already clocked in today"})

    const attendance = await Attendance.create({
      employee: employeeId,
      clockIn: new Date()
    })

    res.json({ message: "Clocked in successfully", attendance })
  } catch (error) {
    return res.status(500).json({ message: "Error clocking in" });
  }
})

// CLOCK OUT 
router.post("/attendance/clock-out", authMiddleware, async (req, res) => {
  try {
    const { employeeId } = req.body;

    const today =  await Attendance.findOne({
      employee: employeeId,
      date: { $gte: new Date().setHours(0, 0, 0, 0) }
    })

    if (!today) return res.status(400).json({ message: "Not clocked in yet" })
    if (today.clockOut) return res.status(400).json({ message: "Already clocked out" })

    today.clockOut = new Date();
    await today.save();

    return res.json({ message: "Clocked out successfully ", today })
  } catch (error) {
    return res.status(500).json({ message: "Error clocking out" })
  }
})

// TASKS
router.get("/my-tasks/:id", authMiddleware, async (req, res) => {
  try {
    const empId = req.params.id
    const tasks = await Task.find({ assignedTo: empId })
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 })

    return res.status(200).json({
      data: tasks,
      message: "Employee tasks fetched successfully"
    })
  } catch (error) {
    return res.status(500).json({ message: error?.message })
  }
})

router.patch("/my-tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true })
    return res.status(200).json({ message: "Task status updated successfully", task})
  } catch (error) {
    return res.status(500).json({ message: error?.message })
  }
})

module.exports = router 