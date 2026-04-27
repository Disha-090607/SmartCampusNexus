const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const createAssignment = async (req, res) => {
  const files = (req.files || []).map((f) => `/uploads/${f.filename}`);

  const created = await Assignment.create({
    ...req.body,
    faculty: req.user._id,
    attachmentUrls: files
  });

  return res.status(201).json(created);
};

const listAssignments = async (req, res) => {
  const filter = {};

  if (req.user.role === 'student') {
    filter.$or = [
      { 'target.semester': req.user.semester },
      { 'target.department': req.user.department },
      { 'target.section': req.user.section },
      { target: { $exists: false } },
      {
        'target.semester': { $exists: false },
        'target.department': { $exists: false },
        'target.section': { $exists: false }
      }
    ];
  }

  if (req.user.role === 'faculty') {
    filter.faculty = req.user._id;
  }

  const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
  return res.json(assignments);
};

const submitAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  const now = new Date();
  const status = now > new Date(assignment.dueDate) ? 'late' : 'submitted';

  const fileUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignmentId, student: req.user._id },
    {
      submissionText: req.body.submissionText,
      fileUrls,
      submittedAt: now,
      status
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(201).json(submission);
};

const gradeSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { grade, remarks } = req.body;

  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    { grade, remarks, status: 'graded' },
    { new: true }
  );

  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  return res.json(submission);
};

const listSubmissions = async (req, res) => {
  const { assignmentId } = req.params;
  const submissions = await Submission.find({ assignment: assignmentId })
    .populate('student', 'name email rollNo')
    .sort({ submittedAt: -1 });
  return res.json(submissions);
};

module.exports = {
  createAssignment,
  listAssignments,
  submitAssignment,
  gradeSubmission,
  listSubmissions
};
