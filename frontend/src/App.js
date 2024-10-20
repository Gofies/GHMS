import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messageResponse, usersResponse] = await Promise.all([
          fetch('/api/hello'),
          fetch('/api/users')
        ]);

        if (!messageResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const messageData = await messageResponse.json();
        const usersData = await usersResponse.json();

        setMessage(messageData.message);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>{message}</h1>
      <h2>Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default App;