import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Root = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
  }, []);
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile">
                  {user.displayName} ({user.username})
                </Link>
              </li>
              <li>
                <Link onClick={logout}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet context={[user, setUser]} />
    </>
  );
};

export default Root;
