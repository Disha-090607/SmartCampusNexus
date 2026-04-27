function ResultsPage({ isAdmin, isFaculty, isStudent, results, resultForm, setResultForm, publishResult, studentUsers }) {
  const canPublish = isAdmin || isFaculty;

  return (
    <section className="card-grid">
      <article className="card wide">
        <h2>{isStudent ? 'My Results' : 'Result Publishing & Records'}</h2>

        {!results.length && <p>No results found yet.</p>}

        {results.map((result) => (
          <div key={result._id} className="list-item">
            <strong>
              Sem {result.semester} - {result.examType}
            </strong>
            {!isStudent && result.student && <p>Student: {result.student.name} ({result.student.email})</p>}
            <p>GPA: {result.gpa ?? 'N/A'}</p>
            <p>
              {result.items
                .map((item) => `${item.subjectCode} (${item.subjectName}) ${item.marks}/${item.maxMarks} - ${item.grade}`)
                .join(' | ')}
            </p>
          </div>
        ))}

        {canPublish && (
          <form className="form-grid" onSubmit={publishResult}>
            <select
              value={resultForm.student}
              onChange={(event) => setResultForm((prev) => ({ ...prev, student: event.target.value }))}
              required
            >
              <option value="">Select student</option>
              {studentUsers.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max="10"
              value={resultForm.semester}
              onChange={(event) => setResultForm((prev) => ({ ...prev, semester: event.target.value }))}
              required
            />
            <input
              placeholder="Exam type"
              value={resultForm.examType}
              onChange={(event) => setResultForm((prev) => ({ ...prev, examType: event.target.value }))}
              required
            />
            <input
              placeholder="Subject code"
              value={resultForm.subjectCode}
              onChange={(event) => setResultForm((prev) => ({ ...prev, subjectCode: event.target.value }))}
              required
            />
            <input
              placeholder="Subject name"
              value={resultForm.subjectName}
              onChange={(event) => setResultForm((prev) => ({ ...prev, subjectName: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Marks"
              value={resultForm.marks}
              onChange={(event) => setResultForm((prev) => ({ ...prev, marks: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Max marks"
              value={resultForm.maxMarks}
              onChange={(event) => setResultForm((prev) => ({ ...prev, maxMarks: event.target.value }))}
              required
            />
            <input
              placeholder="Grade"
              value={resultForm.grade}
              onChange={(event) => setResultForm((prev) => ({ ...prev, grade: event.target.value }))}
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="GPA"
              value={resultForm.gpa}
              onChange={(event) => setResultForm((prev) => ({ ...prev, gpa: event.target.value }))}
            />
            <button type="submit">Publish Result</button>
          </form>
        )}
      </article>
    </section>
  );
}

export default ResultsPage;
