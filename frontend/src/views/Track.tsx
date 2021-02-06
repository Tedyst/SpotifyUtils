import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
    Redirect,
} from 'react-router-dom';
import TrackAnalyze from '../components/Track/TrackAnalyze';

function NoTrack() {
    return <Redirect to="/" />;
}

export default function Track() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:trackid`}>
                <TrackAnalyze />
            </Route>
            <Route path="/">
                <NoTrack />
            </Route>
        </Switch>
    );
}
