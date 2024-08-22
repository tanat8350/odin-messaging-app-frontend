import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/signup`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    const json = await res.json();
    if (!json) {
      // to fix
      return console.log('error');
    }
    navigate('/login');
  };

  return (
    <>
      <h1>Signup</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username </label>
          <input id="username" type="text"></input>
        </div>
        <div>
          <label htmlFor="password">Password </label>
          <input id="password" type="password"></input>
        </div>
        <button type="submit">Signup</button>
      </form>
    </>
  );
};

export default Signup;
