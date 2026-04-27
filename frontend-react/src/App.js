import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from './services/api';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NoticesPage from './pages/NoticesPage';
import TimetablePage from './pages/TimetablePage';
import AssignmentsPage from './pages/AssignmentsPage';
import ResultsPage from './pages/ResultsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import UsersPage from './pages/UsersPage';
import SupportPage from './pages/SupportPage';
import './App.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const APP_MODE = (process.env.REACT_APP_APP_MODE || 'multi-role').toLowerCase();
const CHAT_ROOM = 'global-campus';

function App() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [notices, setNotices] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [chat, setChat] = useState([]);

  const [chatText, setChatText] = useState('');
  const [botInput, setBotInput] = useState('');
  const [botReply, setBotReply] = useState('');
  const [complaintForm, setComplaintForm] = useState({ category: 'other', title: '', description: '', priority: 'medium' });
  const [submissionTextById, setSubmissionTextById] = useState({});
  const [roleByUserId, setRoleByUserId] = useState({});
  const [complaintStatusById, setComplaintStatusById] = useState({});
  const [complaintCommentById, setComplaintCommentById] = useState({});
  const [assignFacultyByComplaintId, setAssignFacultyByComplaintId] = useState({});

  const [noticeForm, setNoticeForm] = useState({ title: '', body: '', audience: 'all', priority: 'normal' });
  const [timetableForm, setTimetableForm] = useState({
    courseCode: '',
    courseName: '',
    room: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    section: 'A',
    semester: 1
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    targetSemester: '',
    targetSection: '',
    targetDepartment: ''
  });
  const [resultForm, setResultForm] = useState({
    student: '',
    semester: 1,
    examType: 'Midterm',
    subjectCode: '',
    subjectName: '',
    marks: '',
    maxMarks: 100,
    grade: '',
    gpa: ''
  });
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: APP_MODE === 'admin-only' ? 'admin' : 'faculty',
    department: ''
  });

  const [faceFile, setFaceFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const socket = useMemo(() => io(SOCKET_URL, { autoConnect: false }), []);
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const facultyUsers = users.filter((u) => u.role === 'faculty');
  const studentUsers = users.filter((u) => u.role === 'student');
  const resultTargetUsers = studentUsers.length ? studentUsers : users;

  const complaintStats = {
    open: complaints.filter((item) => item.status === 'open').length,
    inProgress: complaints.filter((item) => item.status === 'in-progress').length,
    resolved: complaints.filter((item) => item.status === 'resolved').length
  };

  const daySortOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  const sortedTimetable = [...timetable].sort((a, b) => {
    const dayDelta = (daySortOrder[a.day] || 99) - (daySortOrder[b.day] || 99);
    if (dayDelta !== 0) return dayDelta;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const setAuth = (authData) => {
    localStorage.setItem('scn_token', authData.token);
    const currentUser = authData.user || {};
    setUser({
      ...currentUser,
      id: currentUser.id || currentUser._id
    });
  };

  const logout = () => {
    localStorage.removeItem('scn_token');
    setUser(null);
    setUsers([]);
    setDashboard(null);
    setNotices([]);
    setTimetable([]);
    setAssignments([]);
    setResults([]);
    setComplaints([]);
    setChat([]);
  };

  const authSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const payload =
        mode === 'register'
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
              role: APP_MODE === 'admin-only' ? 'admin' : 'student'
            }
          : {
              email: form.email,
              password: form.password
            };

      const data = mode === 'register' ? await api.register(payload) : await api.login(payload);
      setAuth(data);
      setMessage('Authentication successful');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [dash, noticesData, timetableData, assignmentsData, complaintsData, chatData] = await Promise.all([
        api.dashboard(),
        api.notices(),
        api.timetable(),
        api.assignments(),
        api.complaints(),
        api.chatMessages(CHAT_ROOM)
      ]);

      setDashboard(dash);
      setNotices(noticesData);
      setTimetable(timetableData);
      setAssignments(assignmentsData);
      setComplaints(complaintsData);
      setChat(chatData);

      if (user?.role === 'student') {
        const resultData = await api.resultsMe();
        setResults(resultData);
      } else if (user?.role === 'admin' || user?.role === 'faculty') {
        const resultData = await api.resultsAll();
        setResults(resultData);
      } else {
        setResults([]);
      }

      if (user?.role === 'admin') {
        const usersData = await api.users();
        setUsers(usersData);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  const submitComplaint = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.createComplaint(complaintForm);
      setComplaintForm({ category: 'other', title: '', description: '', priority: 'medium' });
      setComplaints(await api.complaints());
      setMessage('Complaint submitted');
    } catch (err) {
      setError(err.message);
    }
  };

  const sendChat = async (event) => {
    event.preventDefault();
    if (!chatText.trim() || !user) return;

    socket.emit('send_message', {
      room: CHAT_ROOM,
      content: chatText,
      sender: user.id
    });

    setChatText('');
  };

  const askBot = async (event) => {
    event.preventDefault();
    if (!botInput.trim()) return;

    try {
      const response = await api.askBot(botInput);
      setBotReply(response.reply);
      setBotInput('');
    } catch (err) {
      setError(err.message);
    }
  };

  const submitAssignment = async (assignmentId) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('submissionText', submissionTextById[assignmentId] || '');
      await api.submitAssignment(assignmentId, formData);
      setMessage('Assignment submitted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const markFaceAttendance = async () => {
    if (!faceFile) return;

    try {
      const formData = new FormData();
      formData.append('image', faceFile);
      const data = await api.faceAttendance(formData);
      setMessage(`Face attendance processed. Verified: ${data.verified}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const createNotice = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await api.createNotice(noticeForm);
      setNoticeForm({ title: '', body: '', audience: 'all', priority: 'normal' });
      setNotices(await api.notices());
      setMessage('Notice created');
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      setError('');
      await api.deleteNotice(noticeId);
      setNotices(await api.notices());
      setMessage('Notice deleted');
    } catch (err) {
      setError(err.message);
    }
  };

  const createTimetableSlot = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await api.createTimetableSlot({
        ...timetableForm,
        faculty: user.id,
        semester: Number(timetableForm.semester)
      });
      setTimetable(await api.timetable());
      setMessage('Timetable slot created');
    } catch (err) {
      setError(err.message);
    }
  };

  const createAssignment = async (event) => {
    event.preventDefault();
    try {
      setError('');
      const payload = {
        title: assignmentForm.title,
        description: assignmentForm.description,
        subject: assignmentForm.subject,
        dueDate: assignmentForm.dueDate,
        target: {
          semester: assignmentForm.targetSemester ? Number(assignmentForm.targetSemester) : undefined,
          section: assignmentForm.targetSection || undefined,
          department: assignmentForm.targetDepartment || undefined
        }
      };
      await api.createAssignment(payload);
      setAssignmentForm({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        targetSemester: '',
        targetSection: '',
        targetDepartment: ''
      });
      setAssignments(await api.assignments());
      setMessage('Assignment created');
    } catch (err) {
      setError(err.message);
    }
  };

  const publishResult = async (event) => {
    event.preventDefault();

    try {
      setError('');
      const payload = {
        student: resultForm.student,
        semester: Number(resultForm.semester),
        examType: resultForm.examType,
        items: [
          {
            subjectCode: resultForm.subjectCode,
            subjectName: resultForm.subjectName,
            marks: Number(resultForm.marks),
            maxMarks: Number(resultForm.maxMarks),
            grade: resultForm.grade
          }
        ],
        gpa: resultForm.gpa === '' ? undefined : Number(resultForm.gpa)
      };

      await api.publishResult(payload);
      setResultForm({
        student: '',
        semester: 1,
        examType: 'Midterm',
        subjectCode: '',
        subjectName: '',
        marks: '',
        maxMarks: 100,
        grade: '',
        gpa: ''
      });

      if (user?.role === 'student') {
        setResults(await api.resultsMe());
      } else if (user?.role === 'admin' || user?.role === 'faculty') {
        setResults(await api.resultsAll());
      }

      setMessage('Result published');
    } catch (err) {
      setError(err.message);
    }
  };

  const updateComplaint = async (complaintId, fallbackStatus) => {
    try {
      setError('');
      const status = complaintStatusById[complaintId] || fallbackStatus;
      const resolutionComment = complaintCommentById[complaintId] || '';
      await api.updateComplaint(complaintId, { status, resolutionComment });
      setComplaints(await api.complaints());
      setMessage('Complaint updated');
    } catch (err) {
      setError(err.message);
    }
  };

  const assignComplaint = async (complaintId) => {
    try {
      setError('');
      const facultyId = assignFacultyByComplaintId[complaintId];
      if (!facultyId) {
        setError('Select a faculty first');
        return;
      }

      await api.assignComplaint(complaintId, facultyId);
      setComplaints(await api.complaints());
      setMessage('Complaint assigned to faculty');
    } catch (err) {
      setError(err.message);
    }
  };

  const updateRole = async (userId, currentRole) => {
    try {
      setError('');
      const nextRole = roleByUserId[userId] || currentRole;
      await api.updateUserRole(userId, nextRole);
      setUsers(await api.users());
      setMessage('User role updated');
    } catch (err) {
      setError(err.message);
    }
  };

  const createUserByAdmin = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await api.createUser(createUserForm);
      setCreateUserForm({
        name: '',
        email: '',
        password: '',
        role: APP_MODE === 'admin-only' ? 'admin' : 'faculty',
        department: ''
      });
      setUsers(await api.users());
      setMessage('User created by admin');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('scn_token');
    if (!token) return;

    api
      .me()
      .then((data) => {
        const currentUser = data.user;
        setUser({
          id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        });
      })
      .catch(() => {
        localStorage.removeItem('scn_token');
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user, loadDashboardData]);

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit('join_room', CHAT_ROOM);

    const onMessage = (incoming) => {
      setChat((prev) => [...prev, incoming]);
    };

    socket.on('receive_message', onMessage);

    return () => {
      socket.off('receive_message', onMessage);
      socket.disconnect();
    };
  }, [socket, user]);

  if (!user) {
    return (
      <AuthPage
        appMode={APP_MODE}
        mode={mode}
        setMode={setMode}
        form={form}
        handleChange={handleChange}
        authSubmit={authSubmit}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <BrowserRouter>
      <main className="layout">
        <header className="topbar">
          <div>
            <h1>SmartCampus Nexus</h1>
            <p>
              {user.name} | Role: {user.role}
            </p>
          </div>
          <button onClick={logout}>Logout</button>
        </header>

        <nav className="page-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/notices" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Notices
          </NavLink>
          <NavLink to="/timetable" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Timetable
          </NavLink>
          <NavLink to="/assignments" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Assignments
          </NavLink>
          <NavLink to="/results" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Results
          </NavLink>
          <NavLink to="/complaints" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Complaints
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Support
          </NavLink>
          {isAdmin && (
            <NavLink to="/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Users
            </NavLink>
          )}
        </nav>

        {loading && <p>Loading...</p>}
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                dashboard={dashboard}
                results={results}
                notices={notices}
                complaints={complaints}
                assignments={assignments}
                timetable={sortedTimetable}
              />
            }
          />
          <Route
            path="/notices"
            element={
              <NoticesPage
                isAdmin={isAdmin}
                noticeForm={noticeForm}
                setNoticeForm={setNoticeForm}
                createNotice={createNotice}
                notices={notices}
                deleteNotice={deleteNotice}
              />
            }
          />
          <Route
            path="/timetable"
            element={
              <TimetablePage
                isAdmin={isAdmin}
                isStudent={isStudent}
                isFaculty={isFaculty}
                timetableForm={timetableForm}
                setTimetableForm={setTimetableForm}
                createTimetableSlot={createTimetableSlot}
                sortedTimetable={sortedTimetable}
              />
            }
          />
          <Route
            path="/assignments"
            element={
              <AssignmentsPage
                isAdmin={isAdmin}
                isFaculty={isFaculty}
                isStudent={isStudent}
                assignmentForm={assignmentForm}
                setAssignmentForm={setAssignmentForm}
                createAssignment={createAssignment}
                assignments={assignments}
                submissionTextById={submissionTextById}
                setSubmissionTextById={setSubmissionTextById}
                submitAssignment={submitAssignment}
              />
            }
          />
          <Route
            path="/results"
            element={
              <ResultsPage
                isAdmin={isAdmin}
                isFaculty={isFaculty}
                isStudent={isStudent}
                results={results}
                resultForm={resultForm}
                setResultForm={setResultForm}
                publishResult={publishResult}
                studentUsers={resultTargetUsers}
              />
            }
          />
          <Route
            path="/complaints"
            element={
              <ComplaintsPage
                isAdmin={isAdmin}
                isStudent={isStudent}
                isFaculty={isFaculty}
                complaintForm={complaintForm}
                setComplaintForm={setComplaintForm}
                submitComplaint={submitComplaint}
                complaints={complaints}
                complaintStatusById={complaintStatusById}
                setComplaintStatusById={setComplaintStatusById}
                complaintCommentById={complaintCommentById}
                setComplaintCommentById={setComplaintCommentById}
                updateComplaint={updateComplaint}
                facultyUsers={facultyUsers}
                assignFacultyByComplaintId={assignFacultyByComplaintId}
                setAssignFacultyByComplaintId={setAssignFacultyByComplaintId}
                assignComplaint={assignComplaint}
                complaintStats={complaintStats}
              />
            }
          />
          <Route
            path="/support"
            element={
              <SupportPage
                chat={chat}
                chatText={chatText}
                setChatText={setChatText}
                sendChat={sendChat}
                botInput={botInput}
                setBotInput={setBotInput}
                askBot={askBot}
                botReply={botReply}
                isStudent={isStudent}
                setFaceFile={setFaceFile}
                markFaceAttendance={markFaceAttendance}
              />
            }
          />
          <Route
            path="/users"
            element={
              isAdmin ? (
                <UsersPage
                  appMode={APP_MODE}
                  users={users}
                  createUserForm={createUserForm}
                  setCreateUserForm={setCreateUserForm}
                  createUserByAdmin={createUserByAdmin}
                  roleByUserId={roleByUserId}
                  setRoleByUserId={setRoleByUserId}
                  updateRole={updateRole}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
