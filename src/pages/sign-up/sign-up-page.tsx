import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationPanel } from '../../components/registration-panel/registration-panel';
import { TextBox } from '../../components/text-box/text-box';
import { paths } from '../../routing/paths';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <RegistrationPanel
      formHeader="create an account"
      submitLabel="sign up"
      swapPanelLabel="sign in to your account"
      onSubmitClick={handleSubmitClick}
      onSwapPanelClick={handleSwapPanelClick}
    >
      <TextBox label="email" variant="dark" value={email} onChange={setEmail} />
      <TextBox label="username" variant="dark" value={userName} onChange={setUserName} />
      <TextBox
        label="password"
        variant="dark"
        inputType="password"
        value={password}
        onChange={setPassword}
      />
      <TextBox
        label="confirm password"
        inputType="password"
        variant="dark"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
    </RegistrationPanel>
  );

  function handleSubmitClick() {
    console.log(userName, password);
  }

  function handleSwapPanelClick() {
    navigate(paths.signIn);
  }
};
