/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import { setLogger } from 'react-query';
import TopPage from './TopPage';
import { renderWithClient } from '../tests/utils';

describe('query component', () => {
    test('base', async () => {
        const expectation = nock('http://localhost')
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
                Success: true,

            });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/Your top artists and tracks/));

        expect(result.getByText(/You really/)).toHaveTextContent('You really love the song nametrack1 aasd');
        expect(result.getByText(/When you only/)).toHaveTextContent('When you only have 2 minutes, 44 seconds, you know what you want');
        expectation.done();
    });

    test('no images', async () => {
        const expectation = nock('http://localhost')
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
                Success: true,

            });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/Your top artists and tracks/));

        expect(result.getByText(/You really/)).toHaveTextContent('You really love the song nametrack1 aasd');
        expect(result.getByText(/When you only/)).toHaveTextContent('When you only have 2 minutes, 44 seconds, you know what you want');
        expectation.done();
    });

    test('no data', async () => {
        const expectation = nock('http://localhost')
            .get('/api/top')
            .reply(200, {
                Result: {
                    Genres: [],
                    Updated: 1622275414,
                    Artists: [],
                    Tracks: [],
                },
                Success: true,

            });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/Your top artists and tracks/));

        expect(result.getByText(/Your top artists and tracks/)).toBeDefined();
        expectation.done();
    });

    test('null data', async () => {
        const expectation = nock('http://localhost')
            .get('/api/top')
            .reply(200, {
                Result: {
                    Genres: null,
                    Updated: null,
                    Artists: null,
                    Tracks: null,
                },
                Success: true,
            });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/Your top artists and tracks/));

        expect(result).not.toBeNull();

        result.getAllByText(/anything/).forEach((v) => {
            expect(v).toHaveTextContent('Could not find anything');
        });
        expectation.done();
    });

    test('no success', async () => {
        const expectation = nock('http://localhost')
            .get('/api/top')
            .reply(200, {
                Result: {
                    Genres: null,
                    Updated: 1622275414,
                    Artists: null,
                    Tracks: null,
                },
                Success: false,
            });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/Your top artists and tracks/));

        expect(result).not.toBeNull();

        result.getAllByText(/anything/).forEach((v) => {
            expect(v).toHaveTextContent('Could not find anything');
        });
        expectation.done();
    });

    test('no internet', async () => {
        const expectation = nock('http://localhost')
            .get('/api/top')
            .reply(500, {});
        setLogger({
            log: () => { },
            warn: () => { },
            error: () => { },
        });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/failed/));

        expect(result.getByText(/failed/)).toHaveTextContent('Error: Request failed with status code 500');
        expectation.done();
    });

    test('error from backend', async () => {
        const expectation = nock('http://localhost')
            .get('/api/top')
            .reply(500, {
                Success: false,
                Error: 'Token expired',
            });
        setLogger({
            log: () => { },
            warn: () => { },
            error: () => { },
        });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/failed/));

        expect(result.getByText(/failed/)).toHaveTextContent('Error: Request failed with status code 500');
        expect(result.getByText(/Token/)).toHaveTextContent('Token expired');
        expectation.done();
    });

    test('corrupt data', async () => {
        const expectation = nock('http://localhost')
            .get('/api/top')
            .reply(200, {
                Result: {
                    Genres: [null, 123],
                    Updated: 123,
                    Artists: [
                        {
                            asd: 'asd',
                        },
                    ],
                    Tracks: [
                        {
                            sdf: 'asd',
                        },
                    ],
                },
                Success: true,
            });
        const result = renderWithClient(<TopPage />);

        await waitFor(() => result.getByText(/Your top artists and tracks/));

        expect(result.getByText(/123/)).toHaveTextContent('123');
        expectation.done();
    });
});
