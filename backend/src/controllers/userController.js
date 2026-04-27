const User = require('../models/User');

const listUsers = async (req, res) => {
  const { role } = req.query;
  const filter = {};

  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 });

  return res.json(users);
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['student', 'faculty', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const updated = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(updated);
};

const createUserByAdmin = async (req, res) => {
  const { name, email, password, role, department, semester, rollNo, employeeId } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'name, email, password and role are required' });
  }

  if (!['student', 'faculty', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const created = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    department,
    semester,
    rollNo,
    employeeId
  });

  const output = created.toObject();
  delete output.password;
  return res.status(201).json(output);
};

module.exports = { listUsers, updateUserRole, createUserByAdmin };