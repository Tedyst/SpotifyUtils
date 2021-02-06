import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from 'react-router-dom';
import Username from '../components/Compare/Username';
import NoUsername from '../components/Compare/NoUsername';

export default function Compare() {
    const match = useRouteMatch();
    const [Word, setWord] = React.useState('');
    return (
        <Switch>
            <Route path={`${match.path}/:code`}>
                <Username
                    Word={Word}
                    setWord={setWord}
                />
            </Route>
            <Route path="/">
                <NoUsername
                    Word={Word}
                    setWord={setWord}
                />
            </Route>
        </Switch>
    );
}
