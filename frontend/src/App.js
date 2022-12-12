import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
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
import ExploreResource from './pages/Explore_resource';

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
          
      <BrowserRouter>
        <NavBar user={user} dispatch={dispatch} notifCount={notifCount}/>
        
        <Routes>
          <Route 
            exact path='/'
            element={<Index/>} />
          <Route 
            path='/login'
            element={<Login/>} />
          <Route 
            path='/search/:q'
            element={<SearchPage/>} />
          <Route 
            path='/explore/projects'
            element={<Explore/>} />
          <Route 
            path='/explore/resources'
            element={<ExploreResource/>} />
          <Route 
            exact path='/project/:id'
            element={<Project/>} />
          <Route 
            exact path='/user/:id'
            element={<User/>}/>
          <Route 
            exact path='/user/:id/notifications'
            element={<Notifications setNotifCount={setNotifCount}/>}
          />
          <Route 
            path='/create_project'
            render={() =>
              !Boolean(user.token) ? (
                  <Navigate to={{ pathname: "/login" }}/>
              ) : (<CreateProject/>)
          }
            />
          <Route 
            exact path='/project/:id/update'
            render={() =>
              !Boolean(user.token) ? (
                  <Navigate to={{ pathname: "/login" }}/>
              ) : (<EditProject/>)
          }
            />
          <Route path='/test'
            element={<Test/>}/>
          
        </Routes>
        

      </BrowserRouter>

    </div>
  );
}



function Test() {
  const token = useAuthState();
  return(
  <p>{token}!</p>)
}
