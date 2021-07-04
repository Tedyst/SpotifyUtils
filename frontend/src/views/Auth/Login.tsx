import React from 'react';
import LoginPage from '../../components/Login/LoginPage';
import LoginWithCode from '../../components/Login/LoginWithCode';

export default function Login(props: {
  CSRFToken: string | undefined,
}) {
  const { CSRFToken } = props;
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const code = params.get('code');
  if (code !== null) {
    return <LoginWithCode code={code} CSRFToken={CSRFToken} />;
  }
  return <LoginPage loggingIn={false} />;
}
