import React, { useContext }from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import './App.css';
import Project  from './pages/Project';
import User  from './pages/User';
import Login from './pages/Login';
import UserContext from './store/UserContext'

export default function App() {
  const user = React.useContext(UserContext);
  console.log('tok' +user.token +'            id'+ user.id);
  return (

    <div className="App">
          
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">CollabSource</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/explore">Explore</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create_project">Create Project</Link>
                </li>
                <li className="nav-item">
                  {user.token ? (
                  <button className="nav-link linkButton"
                  onClick={() => {
                    user.logOut();
                  }} >
                    Logout</button>
                  ) : (
                    <Link className="nav-link" to="/login">Login</Link>
                  )}
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown
                  </a>
                  <div className="dropdown-menu"  href="/#" aria-labelledby="navbarDropdown">
                    <a className="dropdown-item" href="/#">Action</a>
                    <a className="dropdown-item" href="/#">Another action</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="/#">Something else here</a>
                  </div>
                </li>
              
                  
              </ul>
              <ul className="nav navbar-nav navbar-right">
                {/* {% if g.search_form %}
                  <form className="navbar-form" method="get"
                          action="{{ url_for('main.search') }}">
                      <div className="form-group">
                          {{ g.search_form.q(size=20, className='form-control',
                              placeholder=g.search_form.q.label.text) }}
                      </div>
                  </form>
                  {% endif %} */}
                <li className="nav-item">
                {user.id &&
                  <Link className="nav-link" to={`/user/${user.id}`}> Profile </Link>
                }
                </li>
                 {/* <li>
                   <a className="nav-link" href="{{ url_for('main.messages') }}"> 
                     &nbsp; {{ _('Messages') }} &nbsp;
                     {% set new_notifs = current_user.new_requests() %} 
                     {% if new_notifs %}
                       <span className="badge"> {{ new_notifs }} </span>
                     {% endif %}
                   </a>
                 </li> */}
              </ul>
            </div>
          </nav>
        {/* <div>
          <Link to='/'>Home</Link>
          <Link to='/test'>Test</Link>
        </div> */}
        
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
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
  const user = useContext(UserContext);
  return(
  <p>{user.token}!</p>)
}
