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

    test('recent tracks disabled in settings', async () => {
        const expectation = nock('http://localhost')
            .get('/api/status')
            .reply(200, {
                Success: true,
                Username: 'zxc',
                Image: '',
                Playlists: [],
                ID: 'asd',
                Settings: { RecentTracks: false },
            })
            .get(/api\/auth-url.*$/)
            .reply(200, { Success: true, URL: 'https://accounts.spotify.com' })
            .get('/api/top')
            .reply(200, {
                Result: {
                    Genres: ['pop', 'genre2'],
                    Updated: 1622275414,
                    Artists: [
                        {
                            Name: 'artist1',
                            Image: 'https://i.scdn.co/image/ab67616d0000b2739a95e89d24214b94de36ccf7',
                            ID: 'idartist1',
                        },
                    ],
                    Tracks: [
                        {
                            Artist: 'artist1',
                            Name: 'nametrack1 aasd',
                            Image: 'https://i.scdn.co/image/ab67616d0000b2739a95e89d24214b94de36ccf7',
                            ID: 'idtrack1',
                            Duration: 164537,
                            PreviewURL: 'no',
                        },
                    ],
                    Success: true,
                },
            });
        const result = renderWithClient(<App />);

        await waitFor(() => result.getAllByText(/Your top/));

        result.getAllByText(/Listening Statistics/).forEach((value) => {
            expect(value.closest('a')).toHaveClass('Mui-disabled');
        });
        expectation.done();
    });

    test('recent tracks enabled in settings', async () => {
        const expectation = nock('http://localhost')
            .get('/api/status')
            .reply(200, {
                Success: true,
                Username: 'zxc',
                Image: '',
                Playlists: [],
                ID: 'asd',
                Settings: { RecentTracks: true },
            })
            .get(/api\/auth-url.*$/)
            .reply(200, { Success: true, URL: 'https://accounts.spotify.com' })
            .get('/api/top')
            .reply(200, {
                Result: {
                    Genres: ['pop', 'genre2'],
                    Updated: 1622275414,
                    Artists: [
                        {
                            Name: 'artist1',
                            Image: 'https://i.scdn.co/image/ab67616d0000b2739a95e89d24214b94de36ccf7',
                            ID: 'idartist1',
                        },
                    ],
                    Tracks: [
                        {
                            Artist: 'artist1',
                            Name: 'nametrack1 aasd',
                            Image: 'https://i.scdn.co/image/ab67616d0000b2739a95e89d24214b94de36ccf7',
                            ID: 'idtrack1',
                            Duration: 164537,
                            PreviewURL: 'no',
                        },
                    ],
                    Success: true,
                },
            });
        const result = renderWithClient(<App />);

        await waitFor(() => result.getAllByText(/Your top/));

        result.getAllByText(/Listening Statistics/).forEach((value) => {
            expect(value.closest('a')).not.toHaveClass('Mui-disabled');
        });
        expectation.done();
    });
});
