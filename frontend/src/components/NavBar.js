import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import {  logout  } from '../store/UserContext';
import SearchPage from '../pages/SearchPage';

export default function NavBar(props) {
  const [searchq, setSearchq] = useState('');
  const navigate = useNavigate();
  
  const handleLogout = () => {
    //had to move this from App.js into here for history to work
    logout(props.dispatch)
    navigate.replace('/')
  }

  function submitHandler(e) {
    /*For searching */
    e.preventDefault();
    // setSearchq(''); // not sure if this is wanted? (nice to keep search query there)
    navigate.replace(`/search/${searchq}`)
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
                  <Link className="nav-link" to="/explore/projects">Explore</Link>
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
                    <Link className="nav-link" to={`/user/${props.user.user_id}/notifications`}> Notifications 
                    {props.notifCount > 0 &&
                      <span className="badge badge-pill" style={{color: 'white', backgroundColor: '#eb9834', marginLeft: 5}}> { props.notifCount } </span>
                    }
                    </Link>
                }
                </li>

                <li className="nav-item">
                {props.user.user_id !== "" &&
                  <Link className="nav-link" to={`/user/${props.user.user_id}`}> Profile </Link>
                }
                </li>
                <li className="nav-item">
                  {props.user.user_id !== "" ? (
                  <button className="nav-link linkButton"
                  onClick={() => handleLogout()} >
                    Logout</button>
                  ) : (
                    <Link className="nav-link" to="/login">Login</Link>
                  )}
                </li>
              </ul>
            </div>
          </nav>
    )
} 