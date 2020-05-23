import React from 'react';
import './App.css';
import Login from './views/Login';
import ResultView from './views/ResultView';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import {
  setLogged,
  selectLogged,
  setPlaylists
} from './store/user';


function App() {
  const logged = useSelector(selectLogged);
  const dispatch = useDispatch();
  console.log("Logged is " + logged);
  if(!logged){
    fetch('/playlists').then(res => res.json()).then(data => {
      console.log("setLogged" + data.logged);
        dispatch(setLogged(data.logged));
        dispatch(setPlaylists(data.playlists));
      });
    }
  let redirect = null;
  if(!logged){
    redirect = <Redirect to="/auth" />
  } 
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Login />
        </Route>
        <Route path="/test">
          <Home />
        </Route>
        <Route path="/">
          <ResultView />
        </Route>
      </Switch>
      {redirect}
    </Router>
  );
}

function Home() {
  return "Sal"
}

export default App;
