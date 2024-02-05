import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoginForm = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const StyledInput = styled.div`
  padding-right: 25px;
`;

export const StyledHeader = styled.h1`
  text-align: center;
`;

export const StyledButton = styled.button<{ disabled?: boolean }>`
    pointer-events: ${(props) => props.disabled ? 'none' : null};
    opacity: ${(props) => props.disabled ? '0.6' : null};;
`;

export const StyledError = styled.span`
  color: red;
  font-size: 12px;
`;

export const Spacer = styled.div`
  padding-bottom: 10px;
`;