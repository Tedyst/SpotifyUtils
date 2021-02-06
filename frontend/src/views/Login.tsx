import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import LoginPage from '../components/Login/LoginPage';

function LoginWithCode(props: { code: string, CSRFToken: string }) {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery('auth', () => axios.post<AuthInterface>('/api/auth', {
    host: `${window.location.protocol}//${window.location.host}`,
    code: props.code,
  }, {
    withCredentials: true,
    headers: {
      'X-CSRF-Token': props.CSRFToken,
    },
  }));
  if (isLoading) {
    return <LoginPage loggingIn />;
  }
  if (error) {
    return <LoginPage loggingIn={false} />;
  }
  if (data?.data.success) {
    queryClient.invalidateQueries('status');
    queryClient.invalidateQueries('top');
    return <LoginPage loggingIn />;
  }
  return <LoginPage loggingIn />;
}

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

interface AuthInterface {
  success: boolean;
}

interface AuthURLInterface {
  success: boolean;
  URL: string;
}
