import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from 'react-router-dom';
import TrackSearch from '../components/TrackSearch';
import TrackAnalyzePage from './TrackAnalyzePage';

export default function Track() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:trackid`}>
                <TrackAnalyzePage />
            </Route>
            <Route path="/">
                <TrackSearch />
            </Route>
        </Switch>
    );
}
