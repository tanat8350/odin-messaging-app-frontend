import './App.css';
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

function App() {
  const [user] = useOutletContext();
  const [users, setUsers] = useState([]);
  console.log(user);
  useEffect(() => {
    if (!user) {
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/user/${user.id}`)
      .then((res) => res.json())
      .then((json) => setUsers(json));
  }, [user]);
  return (
    <>
      {user ? <h1>Users</h1> : <p>Please login</p>}
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <Link to={`/chat/${user.id}`}>
              {user.displayName} ({user.username})
            </Link>
          </div>
        ))}
    </>
  );
}

export default App;
