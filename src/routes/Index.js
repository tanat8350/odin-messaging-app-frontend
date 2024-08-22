import './App.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user`)
      .then((res) => res.json())
      .then((json) => setUsers(json));
  }, []);
  return (
    <>
      <h1>Users</h1>
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <Link to={`/user/${user.id}`}>{user.username}</Link>
          </div>
        ))}
    </>
  );
}

export default App;
