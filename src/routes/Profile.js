import { useNavigate, useOutletContext } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();
  console.log(user);
  const onSubmit = async (e) => {
    e.preventDefault();
    // not working
    // const formData = new FormData();
    // formData.append('displayName', e.target.displayName.value);
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/user/${user.id}`,
      {
        method: 'put',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: e.target.displayName.value,
        }),
      }
    );
    const json = await res.json();
    if (!json) {
      return console.log('error');
    }
    console.log(json);
    const update = {
      ...user,
      ...json,
    };
    console.log(update);
    setUser(update);
    localStorage.setItem('user', JSON.stringify(update));
    navigate('/');
  };
  if (!user) {
    return <p>Please login</p>;
  }
  return (
    <>
      <h1>Profile</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="displayName">Display Name</label>
        <input id="displayName" type="text" />
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default Profile;
