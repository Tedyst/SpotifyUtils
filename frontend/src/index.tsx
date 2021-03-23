import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createLocalStoragePersistor } from 'react-query/createLocalStoragePersistor-experimental';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from './App';
import reportWebVitals from './reportWebVitals';

Sentry.init({
    dsn: 'https://a38da28ff45041828f3ee7f714af0527@o557174.ingest.sentry.io/5689078',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

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
