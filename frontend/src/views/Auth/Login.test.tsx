/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import Login from './Login';
import { renderWithClient } from '../../tests/utils';

describe('query component', () => {
    test('login button', async () => {
        nock('http://localhost')
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
        const result = renderWithClient(<Login />);

        await waitFor(() => result.getByText('Sign in using Spotify').closest('a'));

        expect(result.getByText('Sign in using Spotify').closest('a')).toHaveAttribute('href', 'https://accounts.spotify.com');
    });
});
