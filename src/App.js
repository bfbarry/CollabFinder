import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory, useParams
} from "react-router-dom";
import './App.css';
import Project  from './components/Project';
import User  from './components/User';

export default function App() {
  return (

    <div className="App">

      <Router>
        <div>
          <Link to='/'>Home</Link>
          <Link to='/test'>Test</Link>
        </div>
        
        <Switch>
          <Route path='/project/:id'>
            <Project />
          </Route>
          <Route path='/user/:id'>
            <User />
          </Route>
          <Route path='/test'>
            <Test />
          </Route>
        </Switch>
        

      </Router>

    </div>
  );
}



function Test() {
  return(
  <p>Testing!</p>)
}
