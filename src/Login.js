import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [User, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [UserError, setUserError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    setUserError('')
    setPasswordError('')

    if ('' === User) {
        setUserError('Please enter your User');
        return;
    }

    if ('' === password) {
        setPasswordError('Please enter a password');
        return;
    }

    if (User !== 'admin' || password !== 'admin') {
        setUserError('User or password wrong');
        setPasswordError('User or password wrong');
        return;
    }

    navigate('/quan-li-doi-xe');
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={User}
          placeholder="Enter your User here"
          onChange={(ev) => setUser(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{UserError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          type="password"
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login