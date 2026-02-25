import React, { useEffect, useState } from 'react';

// members may come as a Python-style string list e.g. "['Alice', 'Bob']"
const parseMembers = (members) => {
  if (Array.isArray(members)) return members;
  if (typeof members === 'string') {
    try {
      // Replace Python single quotes with double quotes for valid JSON
      const json = members.replace(/'/g, '"');
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fallback: split by comma stripping brackets
      return members.replace(/[\[\]']/g, '').split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
        setLoading(false);
        console.log('Teams endpoint:', endpoint);
        console.log('Fetched teams:', results);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div className="card component-card">
      <div className="card-header">👥 Teams</div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-muted py-3">No teams found.</td></tr>
                ) : (
                  teams.map((team, idx) => (
                    <tr key={team.id || idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{team.name || '—'}</strong></td>
                      <td>
                        {(() => {
                          const memberList = parseMembers(team.members);
                          return memberList.length > 0
                            ? memberList.map((m, i) => (
                                <span key={i} className="badge bg-secondary me-1">{typeof m === 'object' ? (m.name || JSON.stringify(m)) : m}</span>
                              ))
                            : <span className="text-muted">No members</span>;
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
