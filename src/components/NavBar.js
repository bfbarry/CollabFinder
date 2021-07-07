import React, {useState} from 'react';
import { Link, useHistory } from "react-router-dom";
import SearchPage from '../pages/SearchPage';

export default function NavBar(props) {
  const [searchq, setSearchq] = useState('')
  const history = useHistory();
  
  function submitHandler(e) {
    e.preventDefault();
    // setSearchq('');
    history.replace(`/search/${searchq}`)

  }
    return(
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
                <form className="navbar-form" method="get"
                        onSubmit={submitHandler}
                        >
                    <input className="form-group"
                    placeholder="Search for a project"
                    type='text' 
                    id='email'
                    value={searchq}
                    onChange={(e) => setSearchq(e.target.value)}>
                    </input>
                    <input type="submit" style={{display: "none"}} />
                </form>
                <li className="nav-item">
                {props.user.user_id !== "" &&
                  <Link className="nav-link" to={`/user/${props.user.user_id}`}> Profile </Link>
                }
                </li>
                <li className="nav-item">
                  {props.user.user_id !== "" ? (
                  <button className="nav-link linkButton"
                  onClick={props.handleLogout} >
                    Logout</button>
                  ) : (
                    <Link className="nav-link" to="/login">Login</Link>
                  )}
                </li>
                 {/* <li>
                   <a className="nav-link" href="{{ url_for('main.messages') }}"> 
                     &nbsp; {{ _('Messages') }} &nbsp;
                     {% set new_notifs = current_props.user.new_requests() %} 
                     {% if new_notifs %}
                       <span className="badge"> {{ new_notifs }} </span>
                     {% endif %}
                   </a>
                 </li> */}
              </ul>
            </div>
          </nav>
        /* <div>
          <Link to='/'>Home</Link>
          <Link to='/test'>Test</Link>
        </div> */
    )
} 