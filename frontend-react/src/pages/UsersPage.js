function UsersPage({
  appMode,
  users,
  createUserForm,
  setCreateUserForm,
  createUserByAdmin,
  roleByUserId,
  setRoleByUserId,
  updateRole
}) {
  const isAdminOnly = appMode === 'admin-only';

  return (
    <section className="card-grid">
      <article className="card wide">
        <h2>User Control Room</h2>
        <form className="form-grid" onSubmit={createUserByAdmin}>
          <input
            placeholder="Full name"
            value={createUserForm.name}
            onChange={(event) => setCreateUserForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={createUserForm.email}
            onChange={(event) => setCreateUserForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Temporary password"
            value={createUserForm.password}
            onChange={(event) => setCreateUserForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <select
            value={createUserForm.role}
            onChange={(event) => setCreateUserForm((prev) => ({ ...prev, role: event.target.value }))}
          >
            {!isAdminOnly && <option value="faculty">Faculty</option>}
            {!isAdminOnly && <option value="student">Student</option>}
            <option value="admin">Admin</option>
          </select>
          <input
            placeholder="Department"
            value={createUserForm.department}
            onChange={(event) => setCreateUserForm((prev) => ({ ...prev, department: event.target.value }))}
          />
          <button type="submit">Create User</button>
        </form>

        <h3 className="top-space">User Role Management</h3>
        {users.map((account) => (
          <div key={account._id} className="list-item">
            <strong>
              {account.name} ({account.email})
            </strong>
            <p>Current role: {account.role}</p>
            <div className="inline-form">
              <select
                value={roleByUserId[account._id] || account.role}
                onChange={(event) => setRoleByUserId((prev) => ({ ...prev, [account._id]: event.target.value }))}
              >
                {!isAdminOnly && <option value="student">Student</option>}
                {!isAdminOnly && <option value="faculty">Faculty</option>}
                <option value="admin">Admin</option>
              </select>
              <button onClick={() => updateRole(account._id, account.role)}>Update Role</button>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
}

export default UsersPage;
