import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory, useParams
} from "react-router-dom";
import './App.css';
import Project  from './components/Project';
import User  from './components/User';

export default function App() {
  return (

    <div className="App">
          
      <Router>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <Link class="navbar-brand" to="/">CollabSource</Link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
          
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                  <Link class="nav-link" activeClassName="active"  to="/explore">Explore</Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/create_project">Create Project</Link>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </div>
                </li>
              
                  
              </ul>
              {/* <ul class="nav navbar-nav navbar-right">
                {% if g.search_form %}
                  <form class="navbar-form" method="get"
                          action="{{ url_for('main.search') }}">
                      <div class="form-group">
                          {{ g.search_form.q(size=20, class='form-control',
                              placeholder=g.search_form.q.label.text) }}
                      </div>
                  </form>
                  {% endif %}
                
                {% if current_user.is_anonymous %}
                <li class="nav-item"><a class="nav-link" href="{{ url_for('auth.login') }}">{{ _('Login') }}</a></li>
                {% else %}
                <li>
                  <a class="nav-link" href="{{ url_for('main.messages') }}"> 
                    &nbsp; {{ _('Messages') }} &nbsp;
                    {% set new_notifs = current_user.new_requests() %} 
                    {% if new_notifs %}
                      <span class="badge"> {{ new_notifs }} </span>
                    {% endif %}
                  </a>
                </li>
                <li class="nav-item"><a class="nav-link" href="{{ url_for('main.user', username=current_user.username) }}">{{ _('Profile') }} &nbsp; </a></li> <!-- fix spacing -->
                <li class="nav-item"><a class="nav-link" href="{{ url_for('auth.logout') }}">{{ _('Logout') }}</a></li>
                {% endif %}
              </ul> */}
            </div>
          </nav>
        {/* <div>
          <Link to='/'>Home</Link>
          <Link to='/test'>Test</Link>
        </div> */}
        
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
