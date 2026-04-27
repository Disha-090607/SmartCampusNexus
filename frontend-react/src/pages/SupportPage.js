function SupportPage({
  chat,
  chatText,
  setChatText,
  sendChat,
  botInput,
  setBotInput,
  askBot,
  botReply,
  isStudent,
  setFaceFile,
  markFaceAttendance
}) {
  return (
    <section className="card-grid">
      <article className="card">
        <h2>Real-time Chat</h2>
        <div className="chat-box">
          {chat.slice(-20).map((m) => (
            <p key={m._id || `${m.createdAt}-${m.content}`}>
              <strong>{m.sender?.name || 'Campus'}:</strong> {m.content}
            </p>
          ))}
        </div>
        <form onSubmit={sendChat} className="inline-form">
          <input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Type message" />
          <button type="submit">Send</button>
        </form>
      </article>

      <article className="card">
        <h2>AI Chatbot Support</h2>
        <form onSubmit={askBot} className="inline-form">
          <input value={botInput} onChange={(event) => setBotInput(event.target.value)} placeholder="Ask something" />
          <button type="submit">Ask</button>
        </form>
        {botReply && <p className="bot-reply">{botReply}</p>}
      </article>

      {isStudent && (
        <article className="card">
          <h2>Face Attendance (Optional)</h2>
          <input type="file" accept="image/*" onChange={(event) => setFaceFile(event.target.files?.[0] || null)} />
          <button onClick={markFaceAttendance}>Mark via Face</button>
        </article>
      )}
    </section>
  );
}

export default SupportPage;
