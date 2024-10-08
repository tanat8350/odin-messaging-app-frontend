import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import updateLastRequest from '../utils/updateLastRequest';
import api from '../configs/api';

const Chat = () => {
  const [user, setUser] = useOutletContext();
  const { recipientid } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [data, setData] = useState([]);

  const fetchRecipient = async () => {
    api.get(`/user/${recipientid}`).then((res) => setRecipient(res.data));
  };

  const fetchMessages = async () => {
    updateLastRequest(user);
    const res = await api.get(`/chat/${user.id}/${recipientid}`);
    const data = await res.data;
    setData(data);
  };

  const onSubmitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', e.target.image.files[0]);
    const res = await api.post(
      `/chat/${user.id}/${recipientid}/image`,
      formData
    );
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    e.target.image.value = '';
    fetchMessages();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    updateLastRequest(user);
    const body = {
      message: e.target.message.value,
    };
    const res = await api.post(`/chat/${user.id}/${recipientid}`, body);
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    e.target.message.value = '';
    fetchMessages();
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchRecipient();
    fetchMessages();
  }, []);

  if (!user) return <p>You must be logged in</p>;
  return (
    <>
      <h1>
        Chat {recipient && `${recipient.displayName} (${recipient.username})`}
      </h1>
      {recipient &&
      [...recipient.friends, ...recipient.friendOf].reduce((a, friend) => {
        if (friend.id === user.id) {
          return (a = true);
        }
      }, false) ? (
        <button
          onClick={async () => {
            await api.delete(`/user/${user.id}/friend`, {
              data: {
                friendId: recipientid,
              },
            });
            fetchRecipient();
          }}
        >
          Remove from friends
        </button>
      ) : (
        <button
          onClick={async () => {
            await api.post(`/user/${user.id}/friend`, {
              friendId: recipientid,
            });
            fetchRecipient();
          }}
        >
          Add to friends
        </button>
      )}
      {data && (
        <div className="mb-10">
          {data.map((msg) =>
            msg.image ? (
              <>
                <p key={msg.id}>
                  {msg.sender.displayName} [
                  {new Date(msg.timestamp).toLocaleString()}
                  ]:
                </p>
                <img
                  key={msg.id}
                  className="h-[100px]"
                  src={`${process.env.REACT_APP_SERVER_URL}/images/${msg.message}`}
                  alt={msg.id}
                />
              </>
            ) : (
              <p key={msg.id}>
                {msg.sender.displayName} [
                {new Date(msg.timestamp).toLocaleString()}
                ]: {msg.message}
              </p>
            )
          )}
        </div>
      )}
      <div className="fixed bottom-0">
        <form onSubmit={onSubmitImage} encType="multipart/form-data">
          <input
            id="image"
            type="file"
            accept="image/jpeg, image/jpg image/png"
          />
          &nbsp;
          <button type="submit">Send image</button>
        </form>
        <form onSubmit={onSubmit}>
          <input id="message" type="text" />
          &nbsp;
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Chat;
