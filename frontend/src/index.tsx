import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { createBrowserHistory } from 'history';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { unregister } from './serviceWorkerRegistration';

import './i18n';

const history = createBrowserHistory();

const isDevelopment = process.env.NODE_ENV === 'development';

Sentry.init({
    dsn: isDevelopment ? '' : 'https://a38da28ff45041828f3ee7f714af0527@o557174.ingest.sentry.io/5689078',
    integrations: [new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    })],
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24 * 7, // a week
            staleTime: 1000 * 60 * 60 * 1, // 1 hour
        },
    },
});

if (!isDevelopment) {
    const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

    persistQueryClient({
        queryClient,
        persistor: localStoragePersistor,
    });
}

ReactDOM.render(
    <Sentry.ErrorBoundary
        fallback={<>An error has occurred</>}
        showDialog
        onError={() => unregister()}
    >
        <QueryClientProvider client={queryClient}>
            <Router history={history}>
                <App />
            </Router>
        </QueryClientProvider>
    </Sentry.ErrorBoundary>,
    document.getElementById('root'),
);

reportWebVitals();
