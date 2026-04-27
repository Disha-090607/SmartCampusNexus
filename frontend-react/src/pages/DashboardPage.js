const DAY_ORDER = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7
};

function numberSafe(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function formatPercent(value) {
  return `${numberSafe(value).toFixed(1)}%`;
}

function DashboardPage({
  dashboard,
  results = [],
  notices = [],
  complaints = [],
  assignments = [],
  timetable = []
}) {
  const stats = dashboard?.stats || {};
  const totalUsers = stats.totalUsers ?? '-';
  const totalNotices = stats.totalNotices ?? notices.length;
  const totalAssignments = stats.totalAssignments ?? assignments.length;
  const openComplaints =
    stats.openComplaints ?? complaints.filter((item) => ['open', 'in-progress'].includes(item.status)).length;

  const allResultItems = results.flatMap((result) => (Array.isArray(result.items) ? result.items : []));

  const marksPercents = allResultItems
    .map((item) => {
      const marks = numberSafe(item.marks, 0);
      const maxMarks = numberSafe(item.maxMarks, 100) || 100;
      return (marks / maxMarks) * 100;
    })
    .filter((value) => Number.isFinite(value));

  const overallMarksAvg = marksPercents.length
    ? marksPercents.reduce((sum, value) => sum + value, 0) / marksPercents.length
    : 0;

  const marksBands = [
    { key: '90-100', min: 90, max: 101, color: '#00a76f' },
    { key: '75-89', min: 75, max: 90, color: '#2f7cff' },
    { key: '60-74', min: 60, max: 75, color: '#f59e0b' },
    { key: '40-59', min: 40, max: 60, color: '#ef6a35' },
    { key: '0-39', min: 0, max: 40, color: '#dc3545' }
  ].map((band) => {
    const value = marksPercents.filter((percent) => percent >= band.min && percent < band.max).length;
    const total = marksPercents.length || 1;
    return {
      ...band,
      value,
      percent: (value / total) * 100
    };
  });

  const subjectMap = new Map();
  allResultItems.forEach((item) => {
    const subject = item.subjectName || item.subjectCode || 'Unknown Subject';
    const marks = numberSafe(item.marks, 0);
    const maxMarks = numberSafe(item.maxMarks, 100) || 100;
    const scorePercent = (marks / maxMarks) * 100;
    const existing = subjectMap.get(subject) || { total: 0, count: 0 };
    subjectMap.set(subject, { total: existing.total + scorePercent, count: existing.count + 1 });
  });

  const subjectPerformance = [...subjectMap.entries()]
    .map(([subject, value]) => ({
      subject,
      avg: value.count ? value.total / value.count : 0
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 6);

  const gradeMap = new Map();
  allResultItems.forEach((item) => {
    const grade = String(item.grade || 'NA').toUpperCase();
    gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1);
  });

  const gradeDistribution = [...gradeMap.entries()]
    .map(([grade, value]) => ({ grade, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const semesterMap = new Map();
  results.forEach((result) => {
    const semester = `Sem ${numberSafe(result.semester, 0)}`;
    const gpa = numberSafe(result.gpa, NaN);
    if (!Number.isFinite(gpa)) return;
    const existing = semesterMap.get(semester) || { total: 0, count: 0 };
    semesterMap.set(semester, { total: existing.total + gpa, count: existing.count + 1 });
  });

  const semesterGpa = [...semesterMap.entries()]
    .map(([semester, value]) => ({ semester, avgGpa: value.total / value.count }))
    .sort((a, b) => numberSafe(a.semester.replace('Sem ', '')) - numberSafe(b.semester.replace('Sem ', '')));

  const maxGpa = Math.max(1, ...semesterGpa.map((item) => item.avgGpa));

  const sortedTimetable = [...timetable].sort((a, b) => {
    const dayDelta = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
    if (dayDelta !== 0) return dayDelta;
    return String(a.startTime || '').localeCompare(String(b.startTime || ''));
  });
  const upcomingClasses = sortedTimetable.slice(0, 5);

  const pendingAssignments = assignments.filter((item) => {
    if (!item.dueDate) return true;
    return new Date(item.dueDate).getTime() >= Date.now();
  }).length;

  const unresolvedComplaints = complaints.filter((item) => ['open', 'in-progress'].includes(item.status)).length;

  return (
    <section className="dashboard-stack">
      <section className="card-grid stats-grid">
        <article className="card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </article>
        <article className="card">
          <h3>Total Notices</h3>
          <p>{totalNotices}</p>
        </article>
        <article className="card">
          <h3>Total Assignments</h3>
          <p>{totalAssignments}</p>
        </article>
        <article className="card">
          <h3>Open Complaints</h3>
          <p>{openComplaints}</p>
        </article>
      </section>

      <section className="card-grid analytics-grid">
        <article className="card wide">
          <div className="title-row">
            <h2>Marks Insight Overview</h2>
            <span className="tiny-label">Academic performance snapshot</span>
          </div>
          <div className="insight-strip">
            <div className="mini-kpi">
              <span>Average Marks</span>
              <strong>{formatPercent(overallMarksAvg)}</strong>
            </div>
            <div className="mini-kpi">
              <span>Total Result Entries</span>
              <strong>{results.length}</strong>
            </div>
            <div className="mini-kpi">
              <span>Subjects Tracked</span>
              <strong>{subjectPerformance.length || 0}</strong>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="title-row">
            <h2>Marks Band Distribution</h2>
            <span className="tiny-label">0-100 range</span>
          </div>
          <div className="meter-list">
            {marksBands.map((band) => (
              <div className="meter-item" key={band.key}>
                <div className="meter-head">
                  <span>{band.key}</span>
                  <strong>{band.value}</strong>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${band.percent}%`, background: band.color }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="title-row">
            <h2>Semester GPA Trend</h2>
            <span className="tiny-label">Average GPA per semester</span>
          </div>
          {!semesterGpa.length && <p className="muted">No GPA data available yet.</p>}
          {!!semesterGpa.length && (
            <div className="bar-list">
              {semesterGpa.map((item) => (
                <div className="bar-item" key={item.semester}>
                  <span>{item.semester}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(item.avgGpa / maxGpa) * 100}%` }}>
                      {item.avgGpa.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="title-row">
            <h2>Top Subject Performance</h2>
            <span className="tiny-label">Average marks %</span>
          </div>
          {!subjectPerformance.length && <p className="muted">No subject marks available.</p>}
          {!!subjectPerformance.length && (
            <div className="bar-list">
              {subjectPerformance.map((item) => (
                <div className="bar-item" key={item.subject}>
                  <span title={item.subject}>{item.subject}</span>
                  <div className="bar-track">
                    <div className="bar-fill alt" style={{ width: `${Math.min(item.avg, 100)}%` }}>
                      {item.avg.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="title-row">
            <h2>Grade Distribution</h2>
            <span className="tiny-label">Latest published records</span>
          </div>
          {!gradeDistribution.length && <p className="muted">No grades available.</p>}
          {!!gradeDistribution.length && (
            <div className="chip-list">
              {gradeDistribution.map((item) => (
                <span className="grade-chip" key={item.grade}>
                  {item.grade}: {item.value}
                </span>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="title-row">
            <h2>Operations Snapshot</h2>
            <span className="tiny-label">Quick system pulse</span>
          </div>
          <div className="ops-grid">
            <div className="ops-card">
              <span>Pending Assignments</span>
              <strong>{pendingAssignments}</strong>
            </div>
            <div className="ops-card">
              <span>Unresolved Complaints</span>
              <strong>{unresolvedComplaints}</strong>
            </div>
            <div className="ops-card">
              <span>Notices Published</span>
              <strong>{notices.length}</strong>
            </div>
            <div className="ops-card">
              <span>Classes Scheduled</span>
              <strong>{timetable.length}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="card-grid">
        <article className="card">
          <div className="title-row">
            <h2>Upcoming Classes</h2>
            <span className="tiny-label">From timetable</span>
          </div>
          {!upcomingClasses.length && <p className="muted">No timetable slots available.</p>}
          {upcomingClasses.map((slot) => (
            <div className="list-item" key={slot._id || `${slot.day}-${slot.startTime}-${slot.courseCode}`}>
              <strong>
                {slot.courseCode} - {slot.courseName}
              </strong>
              <p>
                {slot.day} | {slot.startTime} - {slot.endTime} | Room: {slot.room || 'TBA'}
              </p>
            </div>
          ))}
        </article>

        <article className="card">
          <div className="title-row">
            <h2>Recent Notices</h2>
            <span className="tiny-label">Latest announcements</span>
          </div>
          {!notices.length && <p className="muted">No notices posted yet.</p>}
          {notices.slice(0, 5).map((notice) => (
            <div className="list-item" key={notice._id}>
              <strong>{notice.title}</strong>
              <p>{notice.body}</p>
            </div>
          ))}
        </article>
      </section>
    </section>
  );
}

export default DashboardPage;
