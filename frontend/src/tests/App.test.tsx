/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import App from '../App';
import { renderWithClient } from './utils';

describe('query component', () => {
    test('app does not crash', async () => {
        const expectation = nock('http://localhost')
            .get('/api/status')
            .reply(200, {
                success: false,
                username: 'zxc',
                image: '',
                playlists: [],
                id: 'asd',
                settings: { RecentTracks: true },
            })
            .get(/api\/auth-url.*$/)
            .reply(200, { success: true, URL: 'https://accounts.spotify.com' });
        const result = renderWithClient(<App />);

        await waitFor(() => result.getByText(/Sign in using Spotify/));

        expect(result.getByText(/Sign in using Spotify/)).toHaveTextContent('Sign in using Spotify');
        expectation.done();
    });

    test('recent tracks disabled in settings', async () => {
        const expectation = nock('http://localhost')
            .get('/api/status')
            .reply(200, {
                success: true,
                username: 'zxc',
                image: '',
                playlists: [],
                id: 'asd',
                settings: { RecentTracks: false },
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

        await waitFor(() => result.getAllByText(/Your top/));

        result.getAllByText(/Listening Statistics/).forEach((value) => {
            expect(value.closest('a')).not.toHaveClass('Mui-disabled');
        });
        expectation.done();
    });

    test('can login', async () => {
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

        expect(result.getByText(/zxc/)).toHaveTextContent('zxc');
        expectation.done();
    });

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
