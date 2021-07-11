import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import './App.css';
import Project  from './pages/Project';
import User  from './pages/User';
import Login from './forms/Login';
import CreateProject from './forms/CreateProject';
import EditProject from './forms/EditProject';
import { useAuthState, useAuthDispatch, logout } from './store/UserContext'
import NavBar from './components/NavBar';
import Index from './pages/Index';
import SearchPage from './pages/SearchPage';
import Notifications from './pages/Notifications'; 

export default function App() {
  const dispatch = useAuthDispatch();
  const user = useAuthState();

  const handleLogout = () => {
    logout(dispatch)
  }

  return (

    <div className="App">
          
      <Router>
        <NavBar user={user} handleLogout={handleLogout}/>
        
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
            exact path='/project/:id'
            component={Project} />
          <Route 
            exact path='/user/:id'
            component={User}/>
          <Route 
            exact path='/user/:id/notifications'
            component={Notifications}/>
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
