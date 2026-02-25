import React, { useEffect, useState } from 'react';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const medals = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        const sorted = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
        setLeaders(sorted);
        setLoading(false);
        console.log('Leaderboard endpoint:', endpoint);
        console.log('Fetched leaderboard:', sorted);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div className="card component-card">
      <div className="card-header">🏆 Leaderboard</div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaders.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-muted py-3">No leaderboard data found.</td></tr>
                ) : (
                  leaders.map((leader, idx) => (
                    <tr key={leader.id || idx} style={idx < 3 ? {fontWeight:'bold'} : {}}>
                      <td>
                        {idx < 3
                          ? <span style={{color: medalColors[idx], fontSize:'1.2rem'}}>{medals[idx]}</span>
                          : idx + 1
                        }
                      </td>
                      <td>{leader.user || leader.name || '—'}</td>
                      <td><span className="badge-score">{leader.score ?? '—'}</span></td>
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

export default Leaderboard;
