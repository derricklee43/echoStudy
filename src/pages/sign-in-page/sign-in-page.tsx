import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationPanel } from '../../components/registration-panel/registration-panel';
import { TextBox } from '../../components/text-box/text-box';
import { paths } from '../../routing/paths';

export const SignInPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <RegistrationPanel
      formHeader="sign in to your account"
      submitLabel="sign in"
      swapPanelLabel="create an account"
      onSubmitClick={handleSubmitClick}
      onSwapPanelClick={handleSwapPanelClick}
    >
      <TextBox label="username" variant="dark" value={userName} onChange={setUserName} />
      <TextBox
        label="password"
        variant="dark"
        inputType="password"
        value={password}
        onChange={setPassword}
      />
    </RegistrationPanel>
  );

  function handleSubmitClick() {
    console.log(userName, password);
  }

  function handleSwapPanelClick() {
    navigate(paths.signUp);
  }
};
