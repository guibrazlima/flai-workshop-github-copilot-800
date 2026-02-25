import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/users/`;

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
        console.log('Users endpoint:', endpoint);
        console.log('Fetched users:', results);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [endpoint]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user, idx) => (
          <li key={idx}>
            {user.name ? <span><strong>Name:</strong> {user.name}</span> : null}
            {user.username ? <span> | <strong>Username:</strong> {user.username}</span> : null}
            {!user.name && !user.username ? JSON.stringify(user) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
