import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LoginContainer,
    LoginForm,
    StyledButton,
    StyledInput,
    StyledError,
    StyledHeader,
    Spacer
} from '../styles/LoginStyles';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordMismatch, setPasswordMismatched] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (password1 !== password2) {
                setPasswordMismatched(true);
                return;
            }

            const response = await axios.post('http://localhost:3001/registrations', {
                email,
                password: password1,
                passwordConfirmation: password2,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                // Redirect to Projects table page after successful login
                navigate('/subtasks');
            } else {
                // Handle login failure
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handlePassword2Change = (e: any) => {
        setPassword2(e.target.value);
    }

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSignup}>
                <StyledHeader>Signup</StyledHeader>
                <label>Email:
                    <StyledInput>
                        <input
                            id='email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </StyledInput>
                </label>

                <label>Password:
                    <StyledInput>
                        <input
                            id='password1'
                            type="password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)} />
                    </StyledInput>
                </label>

                <label>Re-enter Password:
                    <StyledInput>
                        <input
                            id='password2'
                            type="password"
                            value={password2}
                            onChange={handlePassword2Change} />
                        {passwordMismatch && <StyledError>Passwords do not match</StyledError>}
                    </StyledInput>
                </label>

                <StyledButton type="submit" disabled={!email || !password1 || !password2}>Sign up</StyledButton>
                <Spacer />
                <StyledButton type="button" onClick={() => navigate('/')}>Login</StyledButton>
            </LoginForm>
        </LoginContainer>
    );
};

export default Signup;