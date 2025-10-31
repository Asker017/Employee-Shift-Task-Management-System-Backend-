  // Departments
const departments = [
  { id: 1, name: "Human Resources" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Sales" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "IT" },
  { id: 6, name: "Operations" },
  { id: 7, name: "Customer Support" },
  { id: 8, name: "Research & Development" },
  { id: 9, name: "Administration" },
];

// Designations
const designations = [
  { id: 1, name: "Intern" },
  { id: 2, name: "Junior Developer" },
  { id: 3, name: "Senior Developer" },
  { id: 4, name: "Team Lead" },
  { id: 5, name: "Project Manager" },
  { id: 6, name: "HR Executive" },
  { id: 7, name: "HR Manager" },
  { id: 8, name: "Accountant" },
  { id: 9, name: "Marketing Executive" },
  { id: 10, name: "Sales Executive" },
  { id: 11, name: "Operations Manager" },
  { id: 12, name: "Customer Support Executive" },
  { id: 13, name: "Research Analyst" },
  { id: 14, name: "Admin Executive" },
];

const shifts = [
  { id: 1, name: "Morning Shift", start: "06:00", end: "14:00" },
  { id: 2, name: "Afternoon Shift", start: "14:00", end: "22:00" },
  { id: 3, name: "Night Shift", start: "22:00", end: "06:00" },
  { id: 4, name: "General Shift", start: "09:00", end: "17:00" },
  { id: 5, name: "Flexible Shift", start: "10:00", end: "18:00" },
];

module.exports = { departments, designations, shifts }