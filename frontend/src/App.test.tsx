/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import App from './App';
import { renderWithClient } from './tests/utils';

describe('query component', () => {
    test('app does not crash', async () => {
        const expectation = nock('http://localhost')
            .get('/api/status')
            .reply(200, {
                Success: false,
                Username: 'zxc',
                Image: '',
                Playlists: [],
                ID: 'asd',
                Settings: { RecentTracks: true },
            })
            .get(/api\/auth-url.*$/)
            .reply(200, { Success: true, URL: 'https://accounts.spotify.com' });
        const result = renderWithClient(<App />);

        await waitFor(() => result.getByText(/Sign in using Spotify/));

        expect(result.getByText(/Sign in using Spotify/)).toHaveTextContent('Sign in using Spotify');
        expectation.done();
    });
});
