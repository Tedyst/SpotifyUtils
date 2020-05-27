import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

export default function Compare(){
    let match = useRouteMatch();
    return (<Switch>
        <Route path={`${match.path}/:username`}>
            <Test />
        </Route>
        <Route path={match.path}>
            No username
        </Route>
    </Switch>);
}

function Test(){
    let { username } = useParams();
    return "Username " + username;
}