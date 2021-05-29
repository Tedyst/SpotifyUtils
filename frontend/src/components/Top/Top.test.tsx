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
                success: true,
                username: 'zxc',
                image: '',
                playlists: [],
                id: 'asd',
                settings: { RecentTracks: true },
            })
            .get(/api\/auth-url.*$/)
            .reply(200, { success: true, URL: 'https://accounts.spotify.com' })
            .get('/api/top')
            .reply(200, {
                result: {
                    genres: ['pop', 'genre2'],
                    updated: 1622275414,
                    artists: [
                        {
                            name: 'artist1',
                            image: 'https://i.scdn.co/image/ab67616d0000b2739a95e89d24214b94de36ccf7',
                            id: 'idartist1',
                        },
                    ],
                    tracks: [
                        {
                            artist: 'artist1',
                            name: 'nametrack1 aasd',
                            image: 'https://i.scdn.co/image/ab67616d0000b2739a95e89d24214b94de36ccf7',
                            id: 'idtrack1',
                            duration: 164537,
                            previewURL: 'no',
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
                success: true,
                username: 'zxc',
                image: '',
                playlists: [],
                id: 'asd',
                settings: { RecentTracks: true },
            })
            .get(/api\/auth-url.*$/)
            .reply(200, { success: true, URL: 'https://accounts.spotify.com' })
            .get('/api/top')
            .reply(200, {
                result: {
                    genres: ['pop', 'genre2'],
                    updated: 1622275414,
                    artists: [
                        {
                            name: 'artist1',
                            image: '',
                            id: 'idartist1',
                        },
                    ],
                    tracks: [
                        {
                            artist: 'artist1',
                            name: 'nametrack1 aasd',
                            image: '',
                            id: 'idtrack1',
                            duration: 164537,
                            previewURL: 'no',
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