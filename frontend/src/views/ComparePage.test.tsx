/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import ComparePage from './ComparePage';
import { renderWithClient } from '../tests/utils';

describe('query component', () => {
    test('compare friends list', async () => {
        const expectation = nock('http://localhost')
            .get('/api/compare')
            .reply(200, {
                friends: [
                    {
                        username: 'user1',
                        name: 'User 1',
                        image: '',
                        code: '123',
                    },
                    {
                        username: 'user2',
                        name: 'User 2',
                        image: 'https://i.scdn.co/image/ab6775700000ee85d22aba98a495d6c14bc56f30',
                        code: '1234',
                    },
                ],
                success: true,
                code: '12345',
            });
        const result = renderWithClient(<ComparePage />);

        await waitFor(() => result.getAllByText(/Your code is/));

        expect(result.getByText(/Your code is/)).toHaveTextContent('Your code is 12345');
        result.getAllByText(/User/).forEach((value) => expect(value.closest('a')).toHaveAttribute('href'));
        expectation.done();
    });

    test('compare friends list with no friends and buggy backend', async () => {
        const expectation = nock('http://localhost')
            .get('/api/compare')
            .reply(200, {
                friends: null,
                success: true,
                code: '12345',
            });
        const result = renderWithClient(<ComparePage />);

        await waitFor(() => result.getAllByText(/Your code is/));

        expect(result.getByText(/Your code is/)).toHaveTextContent('Your code is 12345');
        expectation.done();
    });

    test('compare friends list with no friends', async () => {
        const expectation = nock('http://localhost')
            .get('/api/compare')
            .reply(200, {
                friends: [],
                success: true,
                code: '12345',
            });
        const result = renderWithClient(<ComparePage />);

        await waitFor(() => result.getAllByText(/Your code is/));

        expect(result.getByText(/Your code is/)).toHaveTextContent('Your code is 12345');
        expectation.done();
    });
});
