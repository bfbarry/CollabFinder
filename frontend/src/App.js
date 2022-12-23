import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './index.css';
import Project  from './pages/Project';
import User  from './pages/User';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import { useAuthContext } from './hooks/useAuthContext';
import NavBar from './components/NavBar';
import Index from './pages/Index';
import SearchPage from './pages/SearchPage';
import Notifications from './pages/Notifications'; 
import Explore from './pages/Explore';
import ExploreResource from './pages/Explore_resource';

export default function App() {
  const { user, dispatch } = useAuthContext();
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
            element={user.user_id ? <Index/> : <Login/>} />
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
            element={user.user_id ? (<CreateProject/>)  : <Navigate to="/login"/>}
            />
          <Route 
            exact path='/project/:id/update'
            element={user.token ? <EditProject/> : <Navigate to="/login" /> 
          }
            />
          
        </Routes>
        

      </BrowserRouter>

    </div>
  );
}

