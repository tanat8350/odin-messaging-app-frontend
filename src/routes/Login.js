import { useNavigate, useOutletContext } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [, setUser] = useOutletContext();
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
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
    setUser(json.user);
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: json.user.id,
        username: json.user.username,
        displayName: json.user.displayName,
      })
    );
    localStorage.setItem('token', JSON.stringify(json.token));
    navigate('/');
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username </label>
          <input id="username" type="text"></input>
        </div>
        <div>
          <label htmlFor="password">Password </label>
          <input id="password" type="password"></input>
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
