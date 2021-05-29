import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import App from '../App';

function useCustomHook() {
    return useQuery('customHook', () => 'Hello');
}

describe('query component', () => {
    test('app does not crash', async () => {
        const queryClient = new QueryClient();
        const wrapper = () => (
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        );

        const { result, waitFor } = renderHook(() => useCustomHook(), { wrapper });

        await waitFor(() => result.current.isSuccess);

        expect(result.current.data).toEqual('Hello');
    });
});
