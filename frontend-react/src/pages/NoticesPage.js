function NoticesPage({ isAdmin, noticeForm, setNoticeForm, createNotice, notices, deleteNotice }) {
  return (
    <section className="card-grid">
      <article className="card wide">
        <h2>Notices</h2>
        {isAdmin && (
          <form className="form-grid" onSubmit={createNotice}>
            <input
              placeholder="Notice title"
              value={noticeForm.title}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <textarea
              placeholder="Notice body"
              value={noticeForm.body}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, body: event.target.value }))}
              required
            />
            <select
              value={noticeForm.audience}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, audience: event.target.value }))}
            >
              <option value="all">All</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={noticeForm.priority}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <button type="submit">Publish Notice</button>
          </form>
        )}

        {notices.slice(0, 20).map((notice) => (
          <div key={notice._id} className="list-item">
            <strong>{notice.title}</strong>
            <p>{notice.body}</p>
            <p>Priority: {notice.priority || 'normal'}</p>
            {isAdmin && <button onClick={() => deleteNotice(notice._id)}>Delete</button>}
          </div>
        ))}
      </article>
    </section>
  );
}

export default NoticesPage;
