/* eslint-disable import/no-extraneous-dependencies */
import { render } from '@testing-library/react';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

export function renderWithClient(ui: React.ReactElement) {
    const history = createBrowserHistory();
    const testQueryClient = createTestQueryClient();
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>
            <Router history={history}>
                {ui}
            </Router>
        </QueryClientProvider>,
    );
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) => rerender(
            <QueryClientProvider client={testQueryClient}>
                <Router history={history}>
                    {rerenderUi}
                </Router>
            </QueryClientProvider>,
        ),
    };
}

export function createWrapper() {
    const history = createBrowserHistory();
    const testQueryClient = createTestQueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={testQueryClient}>
            <Router history={history}>
                {children}
            </Router>
        </QueryClientProvider>
    );
}
