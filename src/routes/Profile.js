import { useNavigate, useOutletContext } from 'react-router-dom';
import updateLastRequest from '../utils/updateLastRequest';
import api from '../configs/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();

  const onSubmit = async (e) => {
    e.preventDefault();
    updateLastRequest(user);
    const res = await api.put(`/user/${user.id}`, {
      displayName: e.target.displayName.value,
    });
    const data = await res.data;
    if (!data.success) {
      return console.log('error');
    }
    const update = {
      ...user,
      ...data,
    };
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
        <label htmlFor="displayName">Display Name: </label>
        <input id="displayName" type="text" />
        &nbsp;
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default Profile;
