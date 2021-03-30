import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from 'react-router-dom';
import Username from './Compare/UsernameController';
import NoUsername from './Compare/NoUsernameController';

export default function Compare() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:code`}>
                <Username />
            </Route>
            <Route path="/">
                <NoUsername />
            </Route>
        </Switch>
    );
}
