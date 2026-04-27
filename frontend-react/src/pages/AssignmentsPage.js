function AssignmentsPage({
  isAdmin,
  isFaculty,
  isStudent,
  assignmentForm,
  setAssignmentForm,
  createAssignment,
  assignments,
  submissionTextById,
  setSubmissionTextById,
  submitAssignment
}) {
  const canCreateAssignment = isAdmin || isFaculty;
  const canSubmitAssignment = isStudent;

  return (
    <section className="card-grid">
      <article className="card wide">
        <h2>{canCreateAssignment ? 'Assignments (Create + View)' : 'Assignments'}</h2>

        {canCreateAssignment && (
          <form className="form-grid" onSubmit={createAssignment}>
            <input
              placeholder="Title"
              value={assignmentForm.title}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <textarea
              placeholder="Description"
              value={assignmentForm.description}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
            <input
              placeholder="Subject"
              value={assignmentForm.subject}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, subject: event.target.value }))}
              required
            />
            <input
              type="datetime-local"
              value={assignmentForm.dueDate}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Target semester (optional)"
              value={assignmentForm.targetSemester}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, targetSemester: event.target.value }))}
            />
            <input
              placeholder="Target section (optional)"
              value={assignmentForm.targetSection}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, targetSection: event.target.value }))}
            />
            <input
              placeholder="Target department (optional)"
              value={assignmentForm.targetDepartment}
              onChange={(event) => setAssignmentForm((prev) => ({ ...prev, targetDepartment: event.target.value }))}
            />
            <button type="submit">Create Assignment</button>
          </form>
        )}

        {assignments.map((assignment) => (
          <div key={assignment._id} className="list-item">
            <strong>{assignment.title}</strong>
            <p>
              Subject: {assignment.subject} | Due: {new Date(assignment.dueDate).toLocaleString()}
            </p>
            {canSubmitAssignment && (
              <>
                <textarea
                  placeholder="Write your submission"
                  value={submissionTextById[assignment._id] || ''}
                  onChange={(event) =>
                    setSubmissionTextById((prev) => ({
                      ...prev,
                      [assignment._id]: event.target.value
                    }))
                  }
                />
                <button onClick={() => submitAssignment(assignment._id)}>Submit Assignment</button>
              </>
            )}
          </div>
        ))}
      </article>
    </section>
  );
}

export default AssignmentsPage;
