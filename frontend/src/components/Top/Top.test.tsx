/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import App from '../../App';
import { renderWithClient } from '../../tests/utils';

describe('query component', () => {
    test('top', async () => {
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
                },

            });
        const result = renderWithClient(<App />);

        await waitFor(() => result.getByText(/Your top/));

        expect(result.getByText(/You really/)).toHaveTextContent('You really love the song nametrack1 aasd');
        expect(result.getByText(/When you only/)).toHaveTextContent('When you only have 2 Minutes and 44 Seconds, you know what you want');
        expectation.done();
    });

    test('top without images', async () => {
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
                            Image: '',
                            ID: 'idartist1',
                        },
                    ],
                    Tracks: [
                        {
                            Artist: 'artist1',
                            Name: 'nametrack1 aasd',
                            Image: '',
                            ID: 'idtrack1',
                            Duration: 164537,
                            PreviewURL: 'no',
                        },
                    ],
                },

            });
        const result = renderWithClient(<App />);

        await waitFor(() => result.getByText(/Your top/));

        expect(result.getByText(/You really/)).toHaveTextContent('You really love the song nametrack1 aasd');
        expect(result.getByText(/When you only/)).toHaveTextContent('When you only have 2 Minutes and 44 Seconds, you know what you want');
        expectation.done();
    });
});
