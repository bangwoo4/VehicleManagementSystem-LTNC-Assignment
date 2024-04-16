import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const onButtonClick = () => {
    setUserError('');
    setPasswordError('');

    if (user === '') {
      setUserError('Please enter your User');
      return;
    }

    if (password === '') {
      setPasswordError('Please enter a password');
      return;
    }

    if (user !== 'admin' || password !== 'admin') {
      setPasswordError('User or password wrong');
      return;
    }

    navigate('/quan-li-doi-xe');
  };

  return (
    <div className="mainContainer">
      <div className="loginBox">
        <div className="titleContainer">
          <div className="title">Login 🔐</div>
        </div>
        <div className="inputContainer">
          <input
            value={user}
            placeholder="Enter your User here"
            onChange={(ev) => setUser(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{userError}</label>
        </div>
        <div className="inputContainer">
          <input
            value={password}
            type="password"
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <div className="inputContainer">
          <input
            className="inputButton"
            type="button"
            onClick={onButtonClick}
            value="Log in"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;