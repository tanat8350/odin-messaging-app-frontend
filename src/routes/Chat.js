import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const Chat = () => {
  const [user, setUser] = useOutletContext();
  const { recipientid } = useParams();
  const [data, setData] = useState([]);

  const fetchMessages = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/user/${user.id}/${recipientid}`
    );
    const json = await res.json();
    setData(json);
  };

  const onSubmitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', e.target.image.files[0]);
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/user/${user.id}/${recipientid}`,
      {
        method: 'POST',
        mode: 'cors',
        // tried not work
        // js image files
        // image files
        // files
        // formData + multipart header
        body: formData,
      }
    );
    const json = await res.json();
    if (!json.success) {
      return console.log('error');
    }
    e.target.image.value = '';
    fetchMessages();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/user/${user.id}/${recipientid}`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: e.target.message.value,
        }),
      }
    );
    const json = await res.json();
    if (!json.success) {
      return console.log('error');
    }
    e.target.message.value = '';
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
      <h1>Chat</h1>
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
          <input id="image" type="file" accept="image/*" />
          <button type="submit">Send image</button>
        </form>
        <form onSubmit={onSubmit}>
          <input id="message" type="text" />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Chat;
