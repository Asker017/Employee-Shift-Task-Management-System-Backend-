const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

const router = express.Router()

const generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: "7d",
})

const employeeTypes = [
  { id: 1, role: "Admin" },
  { id: 2, role: "employee" }
]

//Register
router.post("/register", async(req, res) => {
  try {
    const { name, email, password } = req.body
    const role = 1

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: "Email already registered" })

    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

//Login
router.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const valid = user && (await user.matchPassword(password));
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user)
    return res.json({
      id: user.id,
      role: user.role,
      token,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

//Employee Types
router.get("/employeeTypes", (req, res) => {
  try {
    res.json({
      data: employeeTypes,
      message: "Employee types fetched successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employee types"
    })
  }
})

module.exports = router;