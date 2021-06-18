/* eslint-disable max-len */
import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import ListeningStatsComp, { ListeningStatsInterface } from '../components/ListeningStats/ListeningStatsComp';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';
import Loading from '../components/Loading';

export default function ListeningStatsPage() {
    const today = new Date();
    const [selectedDate, setSelectedDate] = React.useState(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0));
    const { data, status, error } = useQuery(['oldtop', selectedDate], () => axios.get<ListeningStatsInterface>(`/api/top/old/${selectedDate.getTime() / 1000}`, {
        withCredentials: true,
    }));

    const err = <ErrorAxiosComponent data={data} status={status} error={error} loadingSpinner={false} />;

    if (status === 'loading') {
        return (
            <>
                {err}
                <ListeningStatsComp
                    data={data?.data}
                    selectedDate={selectedDate}
                    setSelectedDate={(value) => { setSelectedDate(value); }}
                />
                <Loading />
            </>
        );
    }

    return (
        <>
            {err}
            <ListeningStatsComp
                data={data?.data}
                selectedDate={selectedDate}
                setSelectedDate={(value) => { setSelectedDate(value); }}
            />
        </>
    );
}
