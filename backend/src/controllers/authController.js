const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const getRegistrationRole = () => {
  const mode = (process.env.APP_MODE || 'multi-role').toLowerCase();
  return mode === 'admin-only' ? 'admin' : 'student';
};

const isAdminOnlyMode = () => (process.env.APP_MODE || 'multi-role').toLowerCase() === 'admin-only';

const getSessionRole = (user) => (isAdminOnlyMode() ? 'admin' : user.role);

const register = async (req, res) => {
  const { name, email, password, department, semester, rollNo, employeeId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password are required' });
  }

  const normalizedEmail = email.toLowerCase();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: getRegistrationRole(),
    department,
    semester,
    rollNo,
    employeeId
  });

  const sessionRole = getSessionRole(user);
  const token = generateToken({ id: user._id, role: sessionRole });
  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: sessionRole,
      department: user.department,
      semester: user.semester
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const matched = await user.comparePassword(password);
  if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

  const sessionRole = getSessionRole(user);
  const token = generateToken({ id: user._id, role: sessionRole });
  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: sessionRole,
      department: user.department,
      semester: user.semester
    }
  });
};

const me = async (req, res) => {
  const user = req.user.toObject ? req.user.toObject() : req.user;
  return res.json({
    user: {
      ...user,
      role: getSessionRole(req.user)
    }
  });
};

module.exports = { register, login, me };
