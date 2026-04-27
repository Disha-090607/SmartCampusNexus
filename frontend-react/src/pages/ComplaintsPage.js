function ComplaintsPage({
  isAdmin,
  isStudent,
  isFaculty,
  complaintForm,
  setComplaintForm,
  submitComplaint,
  complaints,
  complaintStatusById,
  setComplaintStatusById,
  complaintCommentById,
  setComplaintCommentById,
  updateComplaint,
  facultyUsers,
  assignFacultyByComplaintId,
  setAssignFacultyByComplaintId,
  assignComplaint,
  complaintStats
}) {
  return (
    <section className="card-grid">
      <article className="card wide">
        <h2>{isAdmin ? 'Complaint Management' : isFaculty ? 'Assigned Complaint Desk' : 'Complaint / Feedback'}</h2>

        {(isAdmin || isFaculty) && (
          <div className="chip-row">
            <span className="chip chip-open">Open: {complaintStats.open}</span>
            <span className="chip chip-progress">In Progress: {complaintStats.inProgress}</span>
            <span className="chip chip-resolved">Resolved: {complaintStats.resolved}</span>
          </div>
        )}

        {isStudent && (
          <form className="form-grid" onSubmit={submitComplaint}>
            <select
              value={complaintForm.category}
              onChange={(event) => setComplaintForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option value="academic">Academic</option>
              <option value="hostel">Hostel</option>
              <option value="transport">Transport</option>
              <option value="discipline">Discipline</option>
              <option value="other">Other</option>
            </select>
            <select
              value={complaintForm.priority}
              onChange={(event) => setComplaintForm((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              value={complaintForm.title}
              placeholder="Title"
              onChange={(event) => setComplaintForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <textarea
              value={complaintForm.description}
              placeholder="Description"
              onChange={(event) => setComplaintForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
            <button type="submit">Raise Complaint</button>
          </form>
        )}

        {complaints.slice(0, 20).map((complaint) => (
          <div key={complaint._id} className="list-item">
            <strong>{complaint.title}</strong>
            <p>
              <span className={`status-pill status-${complaint.status}`}>{complaint.status}</span>
              <span className="priority-text">Priority: {complaint.priority || 'medium'}</span>
            </p>
            <p>Raised By: {complaint.raisedBy?.name || 'Student'}</p>
            {(isAdmin || isFaculty) && <p>Assigned To: {complaint.assignedTo?.name || 'Not assigned'}</p>}

            {(isAdmin || isFaculty) && (
              <>
                <select
                  value={complaintStatusById[complaint._id] || complaint.status}
                  onChange={(event) =>
                    setComplaintStatusById((prev) => ({ ...prev, [complaint._id]: event.target.value }))
                  }
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <input
                  placeholder="Resolution comment"
                  value={complaintCommentById[complaint._id] || ''}
                  onChange={(event) =>
                    setComplaintCommentById((prev) => ({ ...prev, [complaint._id]: event.target.value }))
                  }
                />
                <button onClick={() => updateComplaint(complaint._id, complaint.status)}>Update Complaint</button>
              </>
            )}

            {isAdmin && (
              <div className="inline-form top-space">
                <select
                  value={assignFacultyByComplaintId[complaint._id] || ''}
                  onChange={(event) =>
                    setAssignFacultyByComplaintId((prev) => ({ ...prev, [complaint._id]: event.target.value }))
                  }
                >
                  <option value="">Assign faculty</option>
                  {facultyUsers.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                <button onClick={() => assignComplaint(complaint._id)}>Assign</button>
              </div>
            )}
          </div>
        ))}
      </article>
    </section>
  );
}

export default ComplaintsPage;
