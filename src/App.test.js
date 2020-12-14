import React from 'react';
import App from './App';
import store from './store/store.tsx';
import { Provider } from 'react-redux';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
