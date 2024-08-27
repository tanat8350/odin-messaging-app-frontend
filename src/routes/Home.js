import './App.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../configs/api';
import updateLastRequest from '../utils/updateLastRequest';

function App() {
  const navigate = useNavigate();
  const [user] = useOutletContext();
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    updateLastRequest(user);

    api.get(`/user/${user.id}/others`).then((res) => setUsers(res.data));

    api.get(`/user/${user.id}`).then((res) => {
      setUserData(res.data);
    });
  }, [user]);

  const onClickCreateNewGroupChat = () => {
    updateLastRequest(user);
    api.post('/chat/group', { id: user.id }).then((res) => {
      if (!res.data.success) {
        console.error('fail to create group chat');
        return;
      }
      navigate(`/chat/group/${res.data.data.id}`);
    });
  };

  if (!user) return <p>Please login</p>;

  return (
    <>
      <h1>Group chats</h1>
      <button onClick={onClickCreateNewGroupChat}>Create new group chat</button>
      {userData && userData.groupChats.length > 0 ? (
        <div>
          {userData.groupChats.map((group) => (
            <div key={group.id}>
              <Link to={`/chat/group/${group.id}`}>{group.id}</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No group chats</p>
      )}
      <h1>Friends</h1>
      {userData &&
      (userData.friends.length > 0 || userData.friendOf.length > 0) ? (
        <div>
          {[...userData.friends, ...userData.friendOf].map((friend) => (
            <div key={friend.id}>
              <Link to={`/chat/${friend.id}`}>
                {friend.displayName} ({friend.username})
              </Link>
              <span>
                {new Date(
                  new Date() - new Date(friend.lastRequest)
                ).getMinutes() < 5
                  ? ' Online'
                  : ''}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No friends</p>
      )}
      <h1>All Users</h1>
      {user &&
        users.length > 0 &&
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
