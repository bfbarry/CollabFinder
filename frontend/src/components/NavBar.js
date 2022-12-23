import React, {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import {useLogout } from "../hooks/useLogout"
import '../index.css';


export default function NavBar(props) {
  const [searchq, setSearchq] = useState('');
  const { logout } = useLogout();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    //had to move this from App.js into here for history to work
    logout()
  }

  function submitHandler(e) {
    /*For searching */
    e.preventDefault();
    // setSearchq(''); // not sure if this is wanted? (nice to keep search query there)
    navigate(`/search/${searchq}`)
  }

    return(
      <header>
        <div className='container'>
          <Link className="" to="/">CollabSource</Link>
          <Link className="" to="/explore/projects">Explore</Link>
          <Link className="" to="/create_project">Create Project</Link>
              
          <form className="" method="get"
                  onSubmit={submitHandler}
                  >
              <input className=""
              placeholder="Search for a project"
              type='text' 
              id='email'
              value={searchq}
              onChange={(e) => setSearchq(e.target.value)}>
              </input>
              <input type="submit" style={{display: "none"}} />
          </form>
          <nav>
            {props.user.user_id !== "" &&
                <Link className="" to={`/user/${props.user.user_id}/notifications`}> Notifications 
                {props.notifCount > 0 &&
                  <span className="" style={{color: 'white', backgroundColor: '#eb9834', marginLeft: 5}}> { props.notifCount } </span>
                }
                </Link>
            }
          </nav>

          <nav>
            {props.user.user_id !== "" &&
              <Link className="" to={`/user/${props.user.user_id}`}> Profile </Link>
            }
          </nav>
          <nav>
            {props.user.user_id !== "" ? (
            <button className=""
            onClick={() => handleLogout()} >
              Logout</button>
            ) : (
              <Link className="" to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
    )
} 