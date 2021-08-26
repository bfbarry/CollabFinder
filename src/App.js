import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom";
import './App.css';
import Project  from './pages/Project';
import User  from './pages/User';
import Login from './forms/Login';
import CreateProject from './forms/CreateProject';
import EditProject from './forms/EditProject';
import { useAuthState, useAuthDispatch } from './store/UserContext'
import NavBar from './components/NavBar';
import Index from './pages/Index';
import SearchPage from './pages/SearchPage';
import Notifications from './pages/Notifications'; 
import Explore from './pages/Explore';
import Explore_resource from './pages/Explore_resource';

export default function App() {
  const dispatch = useAuthDispatch();
  const user = useAuthState();
  const [notifCount, setNotifCount] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { //should be in user context?
    fetch(`/api/users/${user.user_id}/notif_count`)
    .then(res => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setNotifCount(data.notif_count);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
  }, [user])

  return (

    <div className="App">
          
      <Router>
        <NavBar user={user} dispatch={dispatch} notifCount={notifCount}/>
        
        <Switch>
          <Route 
            exact path='/'
            component={Index} />
          <Route 
            path='/login'
            component={Login} />
          <Route 
            path='/search/:q'
            component={SearchPage} />
          <Route 
            path='/explore/projects'
            component={Explore} />
          <Route 
            path='/explore/resources'
            component={Explore_resource} />
          <Route 
            exact path='/project/:id'
            component={Project} />
          <Route 
            exact path='/user/:id'
            component={User}/>
          <Route 
            exact path='/user/:id/notifications'> 
            <Notifications setNotifCount={setNotifCount}/>
          </Route>
          <Route 
            path='/create_project'
            render={() =>
              !Boolean(user.token) ? (
                  <Redirect to={{ pathname: "/login" }}/>
              ) : (<CreateProject/>)
          }
            />
          <Route 
            exact path='/project/:id/update'
            render={() =>
              !Boolean(user.token) ? (
                  <Redirect to={{ pathname: "/login" }}/>
              ) : (<EditProject/>)
          }
            />
          <Route path='/test'>
            <Test />
          </Route>
          
        </Switch>
        

      </Router>

    </div>
  );
}



function Test() {
  const token = useAuthState();
  return(
  <p>{token}!</p>)
}
