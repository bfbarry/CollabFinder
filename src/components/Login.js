import React, { useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");

    const handleClick = () => {
      const opts = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "username": username,
          "password": password
        })
      }
      fetch('/api/token', opts)
        .then(res => {
          if (res.status === 200) return res.json()
          else console.log("error!!!!!!!!!!!")
        })
        .then(data => {
          sessionStorage.setItem("token", data.access_token)
        })
        .catch(error =>{
          console.error("error", error)
        } )
    }
    return (
      <div className="text-center" style = {{marginLeft: '20px'}}>
        <h1>Login</h1>
        {token && token!="" && token!=undefined ? ("Currently logged in with token: " + token) : 
          (<div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleClick}>Login</button>
          </div>)
        }
      </div>
      
    )
  }