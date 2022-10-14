import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationPanel } from '@/components/registration-panel/registration-panel';
import { TextBox } from '@/components/text-box/text-box';
import { isEmptyObject } from '@/helpers/validator';
import { useUserClient } from '@/hooks/api/use-user-client';
import { IdentityErrorCode } from '@/models/register-user';
import { paths } from '@/routing/paths';
import './sign-up-page.scss';

interface SignUpFormError {
  email?: string;
  username?: string;
  password?: string;
}

export const SignUpPage = () => {
  const userClient = useUserClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formError, setFormError] = useState<SignUpFormError>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <RegistrationPanel
      className="sign-up-panel"
      formHeader="create an account"
      submitLabel="sign up"
      submitLabelLoading={isSubmitting}
      swapPanelLabel="sign in to your account"
      onSubmitClick={handleSubmitClick}
      onSwapPanelClick={handleSwapPanelClick}
    >
      <div className="field-container">
        <TextBox
          label="username"
          autoComplete="username"
          variant="dark-white"
          value={userName}
          onChange={setUserName}
        />
        {getLabelError('', (formError) => formError.username)}
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
        <div className="password-fields">
          <TextBox
            label="password"
            autoComplete="new-password"
            variant="dark-white"
            inputType="password"
            value={password}
            onChange={setPassword}
          />
          <TextBox
            label="confirm password"
            autoComplete="new-password"
            inputType="password"
            variant="dark-white"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>
        {getLabelError(
          'Use 6 or more characters with at least one of each: upper & lower letters, numbers, symbols.',
          (formError) => formError.password
        )}
      </div>
    </RegistrationPanel>
  );

  function getLabelError(
    init: string,
    formErrorValue: (formError: SignUpFormError) => string | undefined
  ) {
    const errorValue = formErrorValue(formError ?? {});
    if (!init && !errorValue) {
      return undefined;
    }

    const errorClass = errorValue ? 'error' : '';
    return <div className={`info-text ${errorClass}`}>{errorValue ?? init}</div>;
  }

  function handleSwapPanelClick() {
    navigate(paths.signIn);
  }

  async function handleSubmitClick() {
    // submitting should be mutually exclusive
    if (isSubmitting) {
      return;
    }

    setFormError(undefined);

    // simple client side verifications
    {
      const newFormError: SignUpFormError = {};
      if (userName === '') {
        newFormError.username ??= 'Username should not be empty.';
      }
      if (email === '') {
        newFormError.email ??= 'Email should not be empty.';
      }
      if (!email.includes('@')) {
        newFormError.email ??= `This doesn't appear to be a valid email.`;
      }
      if (password != confirmPassword) {
        newFormError.password ??= `Those passwords didn't match. Try again.`;
      }
      if (password.length < 6) {
        newFormError.password ??= `Use 6 characters or more for your password.`;
      }

      if (!isEmptyObject(newFormError)) {
        setFormError(newFormError);
        return;
      }
    }

    // let server-side handle complex validations
    // TODO: we should probably validate password security before sending requests?

    try {
      setIsSubmitting(true);
      const data = await userClient.register({
        username: userName,
        email,
        password,
        phoneNumber: '', // TODO: phone number in UI?
      });

      if (!data) {
        throw new Error('An unknown error occurred while submitting the registration form');
      }

      if (data.statusCode === 200) {
        const { id } = data.response;
        console.log('Successfully registered:', id);
        // sign in and redirect to decks page
        const success = await userClient.login(email, password);
        if (success) {
          navigate(paths.decks);
        }
      } else {
        const identityErrors = data.response;
        const newFormError: SignUpFormError = {};
        // apply all errors, but first error of group takes precedence if there are multiple
        identityErrors.forEach((err) => {
          const code: IdentityErrorCode = err.code;
          const desc: string = err.description;
          if (code.includes('UserName')) {
            newFormError.username ??= desc;
          } else if (code.includes('Email')) {
            newFormError.email ??= desc;
          } else if (code.includes('Password')) {
            newFormError.password ??= desc;
          }
        });
        setFormError(newFormError);
      }
    } finally {
      setIsSubmitting(false);
    }
  }
};
