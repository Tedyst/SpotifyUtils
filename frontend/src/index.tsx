import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createLocalStoragePersistor } from 'react-query/createLocalStoragePersistor-experimental';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

const localStoragePersistor = createLocalStoragePersistor();

persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
});

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById('root'),
);

reportWebVitals();
