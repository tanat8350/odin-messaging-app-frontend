import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import api from '../configs/api';
import updateLastRequest from '../utils/updateLastRequest';

const GroupChat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();
  const { groupid } = useParams();
  const [data, setData] = useState(null);

  const fetchMessages = async () => {
    updateLastRequest(user);
    const res = await api.get(`/chat/group/${groupid}`);
    const data = await res.data;
    setData(data);
  };

  const onClickLeaveGroup = async () => {
    updateLastRequest(user);
    const body = {
      userid: user.id,
    };
    const res = await api.delete(`/chat/group/${groupid}/user/`, {
      data: body,
    });
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    navigate('/');
  };

  const onClickDeleteGroup = async () => {
    updateLastRequest(user);
    const res = await api.delete(`/chat/group/${groupid}`);
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    navigate('/');
  };

  const onSubmitSendMessage = async (e) => {
    e.preventDefault();
    const body = {
      senderid: user.id,
      message: e.target.message.value,
    };
    // FormData and postForm not work
    const res = await api.post(`/chat/group/${groupid}/message`, body);
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    e.target.message.value = '';
    fetchMessages();
  };

  const onSubmitAddUser = async (e) => {
    e.preventDefault();
    const body = {
      userid: e.target.addUser.value,
    };
    const res = await api.put(`/chat/group/${groupid}/user/`, body);
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    e.target.addUser.value = '';
    fetchMessages();
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchMessages();
  }, []);

  if (!user) return <p>You must be logged in</p>;
  return (
    <>
      <h1>Group chat {groupid}</h1>
      {data && (
        <>
          <button onClick={onClickLeaveGroup}>Leave Group</button>&nbsp;
          <button onClick={onClickDeleteGroup}>Delete Group</button>
          <p>Click to remove user</p>
          <p>
            Users:{' '}
            {data.users.map((u, i) => (
              <>
                {u.username === user.username ? (
                  <span>{u.displayName}(you)</span>
                ) : (
                  <Link
                    key={u.id}
                    onClick={async (e) => {
                      e.preventDefault();
                      const body = {
                        userid: u.id,
                      };
                      // if delete {data: }, required
                      const res = await api.delete(
                        `/chat/group/${groupid}/user`,
                        { data: body }
                      );
                      const data = await res.data;
                      if (!data.success) {
                        return console.log('error');
                      }
                      fetchMessages();
                    }}
                  >
                    {u.displayName}({u.username})
                  </Link>
                )}
                {i === data.users.length - 1 ? '' : ', '}
              </>
            ))}
          </p>
          <form onSubmit={onSubmitAddUser}>
            <label htmlFor="addUser">Add user (id): </label>
            <input type="text" id="addUser"></input>
            &nbsp;
            <button type="submit">Add</button>
          </form>
        </>
      )}
      {data && (
        <div className="mb-10">
          {data && data.messages.length > 0 ? (
            data.messages.map((msg) => (
              <p key={msg.id}>
                {msg.sender.displayName} [
                {new Date(msg.timestamp).toLocaleString()}
                ]: {msg.message}
              </p>
            ))
          ) : (
            <p>No messages</p>
          )}
        </div>
      )}
      <div className="fixed bottom-0">
        <form onSubmit={onSubmitSendMessage}>
          <input id="message" type="text" />
          &nbsp;
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default GroupChat;
