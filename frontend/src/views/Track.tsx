import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import TrackAnalyze from '../components/Track/TrackAnalyze';
import {
  Redirect,
} from "react-router-dom";

export default function Track(){
    let match = useRouteMatch();
    return (<Switch>
        <Route path={`${match.path}/:trackid`}>
            <TrackAnalyze />
        </Route>
        <Route path="/">
            <NoTrack />
        </Route>
    </Switch>);
}


function NoTrack(){
    return <Redirect to="/" />;
}