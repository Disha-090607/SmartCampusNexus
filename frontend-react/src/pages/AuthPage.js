function AuthPage({
  appMode,
  mode,
  setMode,
  form,
  handleChange,
  authSubmit,
  loading,
  error
}) {
  const isAdminOnly = appMode === 'admin-only';

  return (
    <main className="layout auth-layout">
      <section className="auth-card">
        <h1>SmartCampus Nexus</h1>
        <p className="subtitle">{isAdminOnly ? 'Admin portal authentication' : 'Student, faculty and admin authentication'}</p>
        {mode === 'register' && (
          <p className="subtitle">
            {isAdminOnly
              ? 'Public registration creates Admin accounts in current test mode.'
              : 'Public registration creates Student accounts only.'}
          </p>
        )}
        <form onSubmit={authSubmit} className="form-grid">
          {mode === 'register' && (
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <button className="link-btn" onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}>
          {mode === 'login' ? 'New user? Register here' : 'Already registered? Login here'}
        </button>
        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
}

export default AuthPage;
