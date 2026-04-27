function TimetablePage({
  isAdmin,
  isStudent,
  isFaculty,
  timetableForm,
  setTimetableForm,
  createTimetableSlot,
  sortedTimetable
}) {
  return (
    <section className="card-grid">
      <article className="card wide">
        <h2>Timetable</h2>
        {isAdmin && <p className="subtitle">Section = class group (A/B/C), Semester = year term (1 to 10)</p>}
        {(isStudent || isFaculty) && (
          <p className="subtitle">
            {isStudent
              ? 'Your class plan is auto-filtered for your semester.'
              : 'Your teaching slots are shown automatically.'}
          </p>
        )}

        {isAdmin && (
          <form className="form-grid" onSubmit={createTimetableSlot}>
            <input
              placeholder="Course code"
              value={timetableForm.courseCode}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, courseCode: event.target.value }))}
              required
            />
            <input
              placeholder="Course name"
              value={timetableForm.courseName}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, courseName: event.target.value }))}
              required
            />
            <input
              placeholder="Room"
              value={timetableForm.room}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, room: event.target.value }))}
              required
            />
            <select
              value={timetableForm.day}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, day: event.target.value }))}
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </select>
            <input
              type="time"
              value={timetableForm.startTime}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, startTime: event.target.value }))}
              required
            />
            <input
              type="time"
              value={timetableForm.endTime}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, endTime: event.target.value }))}
              required
            />
            <p className="field-hint">Section (A/B/C)</p>
            <input
              placeholder="Section (A/B/C)"
              value={timetableForm.section}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, section: event.target.value }))}
              required
            />
            <p className="field-hint">Semester (1-10)</p>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="Semester (1-10)"
              value={timetableForm.semester}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, semester: event.target.value }))}
              required
            />
            <button type="submit">Add Slot</button>
          </form>
        )}

        {sortedTimetable.slice(0, 24).map((slot) => (
          <div key={slot._id} className="list-item">
            <strong>
              {slot.day}: {slot.courseCode}
            </strong>
            <p>
              {slot.startTime} - {slot.endTime} | Room {slot.room} | Sem {slot.semester} Section {slot.section}
            </p>
            <p>Faculty: {slot.faculty?.name || 'Unassigned'}</p>
          </div>
        ))}
      </article>
    </section>
  );
}

export default TimetablePage;
