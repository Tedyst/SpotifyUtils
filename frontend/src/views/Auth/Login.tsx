import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import LoginPage from '../../components/Login/LoginPage';
import LoginWithCode from '../../components/Login/LoginWithCode';

export default function Login() {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const code = params.get('code');
  const { data, status } = useQuery('authURL', () => axios.get<AuthURLInterface>(`/api/auth-url?host=${window.location.protocol}//${window.location.host}`, {
    withCredentials: true,
  }));
  if (status === 'error' || status === 'loading' || data === undefined) return <LoginPage loggingIn={false} />;
  if (code === null) {
    return <LoginPage loggingIn={false} />;
  }
  if (data.data.success === false) {
    return <LoginPage loggingIn={false} />;
  }

  return <LoginWithCode code={code} CSRFToken={data.headers['x-csrf-token']} />;
}

interface AuthURLInterface {
  success: boolean;
  URL: string;
}
