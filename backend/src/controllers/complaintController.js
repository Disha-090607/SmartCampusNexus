const Complaint = require('../models/Complaint');
const User = require('../models/User');

const raiseComplaint = async (req, res) => {
  const payload = {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority || 'medium',
    raisedBy: req.user._id
  };

  const created = await Complaint.create(payload);
  return res.status(201).json(created);
};

const listComplaints = async (req, res) => {
  const filter = {};
  if (req.user.role === 'student') {
    filter.raisedBy = req.user._id;
  }

  if (req.user.role === 'faculty') {
    filter.$or = [{ assignedTo: req.user._id }, { assignedTo: null }];
  }

  const complaints = await Complaint.find(filter)
    .populate('raisedBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('resolvedBy', 'name role')
    .sort({ createdAt: -1 });

  return res.json(complaints);
};

const updateComplaint = async (req, res) => {
  const { id } = req.params;
  const existing = await Complaint.findById(id);
  if (!existing) return res.status(404).json({ message: 'Complaint not found' });

  if (req.user.role === 'faculty' && existing.assignedTo && existing.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'This complaint is assigned to another faculty' });
  }

  const update = {
    status: req.body.status || existing.status,
    resolutionComment: req.body.resolutionComment || existing.resolutionComment,
    resolvedBy: req.user._id
  };

  if (req.body.priority) {
    update.priority = req.body.priority;
  }

  const complaint = await Complaint.findByIdAndUpdate(id, update, { new: true });
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  return res.json(complaint);
};

const assignComplaint = async (req, res) => {
  const { id } = req.params;
  const { facultyId } = req.body;

  const faculty = await User.findById(facultyId);
  if (!faculty || faculty.role !== 'faculty') {
    return res.status(400).json({ message: 'Valid facultyId is required' });
  }

  const complaint = await Complaint.findByIdAndUpdate(
    id,
    { assignedTo: facultyId, status: 'in-progress' },
    { new: true }
  )
    .populate('assignedTo', 'name email role')
    .populate('raisedBy', 'name email role');

  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  return res.json(complaint);
};

module.exports = { raiseComplaint, listComplaints, updateComplaint, assignComplaint };
