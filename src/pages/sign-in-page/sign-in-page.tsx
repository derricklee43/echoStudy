import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationPanel } from '../../components/registration-panel/registration-panel';
import { TextBox } from '../../components/text-box/text-box';
import { useUserClient } from '../../hooks/api/use-user-client';
import { paths } from '../../routing/paths';

export const SignInPage = () => {
  const userClient = useUserClient();
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
    userClient.login(userName, password).then((success) => {
      if (success) {
        // navigate to the previous page redirected here, or /decks page as a fallback
        const hasPreviousPage = window.history.state && window.history.state.idx > 0;
        if (hasPreviousPage) {
          navigate(-1);
        } else {
          navigate(paths.decks);
        }
      }
    });
  }

  function handleSwapPanelClick() {
    navigate(paths.signUp);
  }
};
