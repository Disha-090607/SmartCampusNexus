const ENV_API_BASE = process.env.REACT_APP_API_URL;
const BROWSER_HOST = typeof window !== 'undefined' ? window.location.hostname : null;

const API_BASE_CANDIDATES = Array.from(
  new Set(
    [
      ENV_API_BASE,
      BROWSER_HOST ? `http://${BROWSER_HOST}:5000/api` : null,
      'http://localhost:5000/api',
      'http://127.0.0.1:5000/api'
    ].filter(Boolean)
  )
);

const request = async (path, options = {}) => {
  const token = localStorage.getItem('scn_token');
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  let lastNetworkError = null;
  const attemptedUrls = [];

  for (const baseUrl of API_BASE_CANDIDATES) {
    try {
      attemptedUrls.push(baseUrl);
      const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      const isNetworkError = error instanceof TypeError;
      if (!isNetworkError) {
        throw error;
      }

      lastNetworkError = error;
    }
  }

  throw new Error(
    `Unable to reach backend API. Tried: ${attemptedUrls.join(', ')}. Ensure backend is running on port 5000 (${lastNetworkError?.message || 'network error'})`
  );
};

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  users: () => request('/users'),
  createUser: (payload) => request('/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUserRole: (userId, role) =>
    request(`/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  dashboard: () => request('/dashboard'),
  notices: () => request('/notices'),
  createNotice: (payload) => request('/notices', { method: 'POST', body: JSON.stringify(payload) }),
  deleteNotice: (noticeId) => request(`/notices/${noticeId}`, { method: 'DELETE' }),
  timetable: () => request('/timetables'),
  createTimetableSlot: (payload) => request('/timetables', { method: 'POST', body: JSON.stringify(payload) }),
  attendanceMe: () => request('/attendance/me'),
  assignments: () => request('/assignments'),
  createAssignment: (payload) => request('/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  submitAssignment: (assignmentId, body) => request(`/assignments/${assignmentId}/submit`, { method: 'POST', body }),
  resultsMe: () => request('/results/me'),
  resultsAll: () => request('/results'),
  studentResults: (studentId) => request(`/results/student/${studentId}`),
  publishResult: (payload) => request('/results', { method: 'POST', body: JSON.stringify(payload) }),
  complaints: () => request('/complaints'),
  createComplaint: (payload) => request('/complaints', { method: 'POST', body: JSON.stringify(payload) }),
  updateComplaint: (complaintId, payload) =>
    request(`/complaints/${complaintId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  assignComplaint: (complaintId, facultyId) =>
    request(`/complaints/${complaintId}/assign`, { method: 'PUT', body: JSON.stringify({ facultyId }) }),
  chatMessages: (room) => request(`/chat/${room}`),
  sendChat: (room, payload) => request(`/chat/${room}`, { method: 'POST', body: JSON.stringify(payload) }),
  askBot: (message) => request('/chatbot/ask', { method: 'POST', body: JSON.stringify({ message }) }),
  faceAttendance: (formData) => request('/face/attendance', { method: 'POST', body: formData })
};
