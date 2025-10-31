const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const authRoutes = require('./routes/authRoutes')
const dashboardRoutes = require("./routes/dashboardRoutes")
const employeeRoutes = require("./routes/employeeRoutes")

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api", dashboardRoutes)
app.use("/api/employee", employeeRoutes)

app.get("/", (req, res) => {
  res.send("API is running...")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))