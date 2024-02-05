import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginForm,
  StyledInput,
  Spacer,
  StyledError,
  StyledHeader,
  StyledButton
} from '../styles/LoginStyles';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        // Redirect to Projects table Page after successful login
        navigate('/subtasks');
      } else {
        // Handle login failure
      }
    } catch (error) {
      setError('Enter valid credentials');
      console.error('Error during login:', error);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogin}>
        <StyledHeader>Login</StyledHeader>
        <label>Email:</label>
        <StyledInput>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </StyledInput>

        <label>Password:</label>
        <StyledInput>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </StyledInput>

        <StyledButton type="submit" disabled={!email || !password}>Login</StyledButton>
        <Spacer />
        <StyledButton type="submit" onClick={() => navigate('/signup')}>Sign up</StyledButton>
        {error && <StyledError>{error}</StyledError>}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;