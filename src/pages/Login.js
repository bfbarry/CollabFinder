import React, { useState, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../store/UserContext';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");
    const history = useHistory();

    const userCtx = useContext(UserContext);

    const handleClick = () => {

      const opts = {
        method: 'POST',
        headers: new Headers({
          "Authorization": `Basic ${btoa(`${username}:${password}`)}`
        }),
      }
      fetch('/api/tokens', opts)
        .then(res => {
          if (res.status === 200) return res.json()
          else console.log("error!!!!!!!!!!!")
        })
        .then(data => {
          userCtx.setToken(data.token);
          sessionStorage.setItem("token", data.token);
          userCtx.setId(data.user_id);
          sessionStorage.setItem("user_id", data.user_id);
          history.replace('/')
        })
        .catch(error =>{
          console.error("error", error)
        } )
    }

    return (
      <div className="text-center" style = {{marginLeft: '20px'}}>
        <h1>Login</h1> {/* maybe can also use onSubmit with form and useRef, and useHistory */}
        {token && token!=="" && token!==undefined ? ("Currently logged in with token: " + token) : 
          (<div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleClick}>Login</button>
          </div>)
        }
      </div>
      
    )
  }