function DashboardPage({ dashboard }) {
  return (
    <section className="card-grid stats-grid">
      <article className="card">
        <h3>Total Users</h3>
        <p>{dashboard?.stats?.totalUsers ?? '-'}</p>
      </article>
      <article className="card">
        <h3>Total Notices</h3>
        <p>{dashboard?.stats?.totalNotices ?? '-'}</p>
      </article>
      <article className="card">
        <h3>Total Assignments</h3>
        <p>{dashboard?.stats?.totalAssignments ?? '-'}</p>
      </article>
      <article className="card">
        <h3>Open Complaints</h3>
        <p>{dashboard?.stats?.openComplaints ?? '-'}</p>
      </article>
    </section>
  );
}

export default DashboardPage;
