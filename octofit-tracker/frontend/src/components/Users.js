import React, { useEffect, useState } from 'react';

const parseMembers = (members) => {
  if (Array.isArray(members)) return members;
  if (typeof members === 'string') {
    try {
      const parsed = JSON.parse(members.replace(/'/g, '"'));
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return members.replace(/[\[\]']/g, '').split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/users/`;
  const teamsEndpoint = `https://${codespaceName}-8000.app.github.dev/api/teams/`;

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch(endpoint).then(r => r.json()),
      fetch(teamsEndpoint).then(r => r.json()),
    ]).then(([uData, tData]) => {
      setUsers(uData.results || uData);
      setTeams(tData.results || tData);
      setLoading(false);
      console.log('Users:', uData, 'Teams:', tData);
    }).catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserTeam = (userName) => {
    return teams.find(t => parseMembers(t.members).includes(userName)) || null;
  };

  const openEdit = (user) => {
    const team = getUserTeam(user.name);
    setEditUser({ ...user, teamId: team ? team.id : '' });
    setSaveError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      // 1. Update user details
      const userRes = await fetch(`${endpoint}${editUser.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editUser.name, email: editUser.email }),
      });
      if (!userRes.ok) throw new Error(`User update failed: ${userRes.status}`);

      // 2. Update team memberships
      const oldTeam = getUserTeam(users.find(u => u.id === editUser.id)?.name || '');
      const newTeam = teams.find(t => t.id === editUser.teamId) || null;

      if (oldTeam && oldTeam.id !== editUser.teamId) {
        const oldMembers = parseMembers(oldTeam.members).filter(m => m !== (users.find(u => u.id === editUser.id)?.name));
        await fetch(`${teamsEndpoint}${oldTeam.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: oldMembers }),
        });
      }

      if (newTeam && (!oldTeam || oldTeam.id !== newTeam.id)) {
        const newMembers = [...new Set([...parseMembers(newTeam.members), editUser.name])];
        await fetch(`${teamsEndpoint}${newTeam.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: newMembers }),
        });
      }

      setEditUser(null);
      fetchAll();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="card component-card">
      <div className="card-header">👤 Users</div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted py-3">No users found.</td></tr>
                ) : (
                  users.map((user, idx) => {
                    const team = getUserTeam(user.name);
                    return (
                      <tr key={user.id || idx}>
                        <td>{idx + 1}</td>
                        <td><strong>{user.name || '—'}</strong></td>
                        <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email || '—'}</a></td>
                        <td>
                          {team
                            ? <span className="badge bg-success">{team.name}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(user)}>
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* Edit Modal */}
    {editUser && (
      <div className="modal show d-block" tabIndex="-1" style={{background:'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{background:'#1a1a2e'}}>
              <h5 className="modal-title" style={{color:'#e94560'}}>✏️ Edit User</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setEditUser(null)}></button>
            </div>
            <div className="modal-body">
              {saveError && <div className="alert alert-danger">{saveError}</div>}
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.name}
                  onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Team</label>
                <select
                  className="form-select"
                  value={editUser.teamId}
                  onChange={e => setEditUser({ ...editUser, teamId: e.target.value })}
                >
                  <option value="">— No Team —</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Users;
