import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch initial data for message and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messageResponse, usersResponse] = await Promise.all([
          fetch('/api/hello'),
          fetch('/api/users'),
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

  // Handle form submission for adding a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(''); // Clear previous messages
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (response.ok) {
        setFormMessage('User added successfully');
        setName('');
        setEmail('');
        setUsers((prevUsers) => [...prevUsers, data.user]); // Add new user to the list
      } else {
        setFormMessage(data.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setFormMessage('Error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App">
      {/* Display backend message and user list */}
      <div>
        <h1>{message}</h1>
        <h2>Users:</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* Form for adding a new user */}
      <div>
        <h1>Add a new user</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={formLoading}>
            {formLoading ? 'Adding...' : 'Add User'}
          </button>
        </form>
        {formMessage && <p>{formMessage}</p>}
      </div>
    </div>
  );
}

export default App;
