/* eslint-disable max-len */
import React from 'react';
import { Container } from '@material-ui/core';
import { useQuery } from 'react-query';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Loading from '../components/Loading';
import ListeningStatsComp, { ListeningStatsInterface } from '../components/ListeningStats/ListeningStatsComp';

export default function ListeningStatsPage() {
    const today = new Date();
    const [selectedDate, setSelectedDate] = React.useState(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0));
    const { data, status, error } = useQuery(['oldtop', selectedDate], () => axios.get<ListeningStatsInterface>(`/api/top/old/${selectedDate.getTime() / 1000}`, {
        withCredentials: true,
    }));

    let errorComponent = null;
    if (status === 'error' || data?.data.Success === false) {
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">{error.toString()}</Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">Could not extract data from server</Alert>
                </Container>
            );
        }
        return (
            <div>
                {errorComponent}
                <Loading />
            </div>
        );
    }
    if (data === undefined || status === 'loading' || data?.data === undefined) return <Loading />;

    return (
        <ListeningStatsComp
            data={data.data}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
        />
    );
}
