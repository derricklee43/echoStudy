import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationPanel } from '@/components/registration-panel/registration-panel';
import { TextBox } from '@/components/text-box/text-box';
import { isEmptyObject } from '@/helpers/validator';
import { useAccountClient } from '@/hooks/api/use-account-client';
import { paths } from '@/routing/paths';
import './sign-in-page.scss';

interface SignInFormError {
  email?: string;
  password?: string;
  generic?: string;
}

export const SignInPage = () => {
  const userClient = useAccountClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formError, setFormError] = useState<SignInFormError>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <RegistrationPanel
      className="sign-in-panel"
      formHeader="sign in to your account"
      submitLabel="sign in"
      swapPanelLabel="create an account"
      submitLabelLoading={isSubmitting}
      onSubmitClick={handleSubmitClick}
      onSwapPanelClick={handleSwapPanelClick}
    >
      <div className="field-container centered">
        {getLabelError('', (formError) => formError.generic)}
      </div>
      <div className="field-container">
        <TextBox
          label="email"
          autoComplete="email"
          variant="dark-white"
          value={email}
          onChange={setEmail}
        />
        {getLabelError('', (formError) => formError.email)}
      </div>
      <div className="field-container">
        <TextBox
          label="password"
          autoComplete="current-password"
          variant="dark-white"
          inputType="password"
          value={password}
          onChange={setPassword}
        />
        {getLabelError('', (formError) => formError.password)}
      </div>
    </RegistrationPanel>
  );

  function handleSwapPanelClick() {
    navigate(paths.signUp);
  }

  async function handleSubmitClick() {
    if (isSubmitting) {
      return;
    }

    setFormError(undefined);

    // simple client side verifications
    {
      const newFormError: SignInFormError = {};
      console.log(email.length, password.length);
      if (email.length === 0) {
        newFormError.email ??= 'Email should not be empty.';
      }
      if (!email.includes('@')) {
        newFormError.email ??= `This doesn't appear to be a valid email.`;
      }
      if (password.length === 0) {
        newFormError.password ??= `Password should not be empty.`;
      }

      if (!isEmptyObject(newFormError)) {
        setFormError(newFormError);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const success = await userClient.login(email, password);
      if (success) {
        // navigate to the previous page redirected here, or /decks page as a fallback
        const hasPreviousPage = window.history.state && window.history.state.idx > 0;
        if (hasPreviousPage) {
          navigate(-1);
        } else {
          navigate(paths.decks);
        }
      } else {
        setFormError({
          generic: 'Incorrect email or password. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function getLabelError(
    init: string,
    formErrorValue: (formError: SignInFormError) => string | undefined
  ) {
    const errorValue = formErrorValue(formError ?? {});
    if (!init && !errorValue) {
      return undefined;
    }

    const errorClass = errorValue ? 'error' : '';
    return <div className={`info-text ${errorClass}`}>{errorValue ?? init}</div>;
  }
};
