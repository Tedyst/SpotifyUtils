import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
    Redirect,
} from 'react-router-dom';
import TrackAnalyzePage from './TrackAnalyzePage';

export default function Track() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:trackid`}>
                <TrackAnalyzePage />
            </Route>
            <Route path="/">
                <Redirect to="/" />
            </Route>
        </Switch>
    );
}
