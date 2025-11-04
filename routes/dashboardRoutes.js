const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware")
const User = require("../models/User")
const shiftAssignmentSchema = require("../models/ShiftAssignment")
const { departments, designations, shifts } = require("../Data/dropdownDatas");
const ShiftAssignment = require("../models/ShiftAssignment");
const Task = require("../models/Task")
const sendEmail = require("../utils/sendEmail")
const generateWelcomeEmail = require("../utils/generateWelcomeEmail")

const router = express.Router()

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to dashboard!", user: req.user })
})

// Add Employee
router.post("/add-employee", authMiddleware, async(req, res) => {
  try {
    const { name, email, password, department, designation } = req.body
    const role = 2
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: "Email already registered" })

    const user = await User.create({ name, email, password, role, department, designation });

    await sendEmail(
      email,
      "Welcome to ESMS",
      generateWelcomeEmail(name)
    )

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: department,
      designation: designation
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get("/employees-list", authMiddleware, async(req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit

    const employees = await User.find({ role: 2 }).skip(skip).limit(limit)
    const total = await User.countDocuments()

    return res.status(200).json({ message: "Employees list fetched successfully", data: employees, total, page, totalPages: Math.ceil(total/limit) })
  } catch (error) {
    return res.status(500).json({ message: err.message })
  }
})

router.get("/recent-employees", authMiddleware, async (req, res) => {
  try {
    const slicedList = await User.find()
    .sort({ createdAt: -1 })
    .limit(3)
    return res.status(200).json({ message: "Recent employees list fetched successfully", data: slicedList })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.delete("/employees/:id", authMiddleware, async(req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.put("/employees/:id", authMiddleware, async(req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    if(!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.get("/departments", (req, res) => {
  try {
    res.json({ data: departments, message: "Departments fetched successfully"})
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments "})
  }
})

router.get("/designations", (req, res) => {
  try {
    return res.json({ data: designations, message: "designations fetched successfully"})
  } catch (error) {
    return res.status(500).json({ message: "Error fetching designations "})
  }
})

router.get("/employeesForShift", async (req, res) => {
  try {
    const employees = await User.find({ role: 2 }, "name _id");

    return res.json({
      data: employees,
      message: "Employees fetched successfully"
    })
  } catch (error) {
    return res.status(500).json({ message: "Error fetching employees" })
  }
})

router.get("/shifts", async (req, res) => {
  try {
    return res.json({
      data: shifts,
      message: "Shifts fetched successfully"
    })
  } catch (error) {
    return res.status(500).json({ message: "Error fetching shifts" })
  }
})

router.post("/assign-shift", async(req, res) => {
  try {
    const { employee, shift } = req.body;

    if(!employee || !shift) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const shiftExists = await shiftAssignmentSchema.findOne({ employee })
    if (shiftExists) {
      return res.status(500).json({ message: "Shift already assigned to this employee" })
    }

    const assignment = new shiftAssignmentSchema({
      employee,
      shift,
    })

    await assignment.save();

    return res.status(201).json({ data: assignment, message: "Shift assigned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error assigning shift" });
  }
})

router.get("/employees-with-shifts", async(req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit

    const data = await shiftAssignmentSchema.find().populate("employee", "name").lean().skip(skip).limit(limit)
    const total = await shiftAssignmentSchema.countDocuments()

    const response = data.map(item => ({
      _id: item._id,
      employeeName: item.employee?.name,
      employeeId: item.employee?._id,
      shift: item.shift,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return res.status(201).json({
      data: response,
      message: "Employees with shift data fetched successfully",
      total: total,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return res.status(500).json({ message: "Error fetching employees with shifts data "})
  }
})

router.put("/employees-shift/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await shiftAssignmentSchema.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.delete("/employees-shift/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await shiftAssignmentSchema.findByIdAndDelete(id)
    return res.json({ message: "Employee shift deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.get("/employees-stats", authMiddleware, async (req, res) => {
  try {
    const employeesCount = await User.countDocuments({ role: 2 })
    const departmentsCount = departments.length
    const designationsCount = designations.length

    return res.status(201).json({ message: "Counts fetched successfully", 
      data: {
        employees: employeesCount,
        departments: departmentsCount,
        designations: designationsCount,
      }
     })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

// TASKS
router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if(!title || !assignedTo) {
      return res.status(400).json({ message: "title and assigned to are required" })
    }

    const user = await User.findById(assignedTo).select("role name email")
    if(!user) {
      return res.status(404).json({ message: "Assigned employee not found " })
    }
    if(!user.role === 2) {
      return res.status(400).json({ message: "Assigned user is not an employee "})
    }

    const task = await Task.create({
      title,
      description,
      assignedTo
    })

    await task.populate("assignedTo", "name email")

    return res.status(201).json({
      message: "Task created successfully",
      data: task,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.get("/all-tasks", authMiddleware, async(req, res) => {
  try {
    const tasks = await Task.find()
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      data: tasks
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.delete("/all-tasks/:id", authMiddleware, async(req, res) => {
  try {
    const { id } = req.params
    await Task.findByIdAndDelete(id)
    return res.status(200).json({ message: "Task deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router;