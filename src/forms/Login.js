import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import { loginUser, useAuthState, useAuthDispatch} from '../store/UserContext';

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  
  const dispatch = useAuthDispatch();
  const { loading, errorMessage } = useAuthState() //read values of loading and errorMessage from context

  const handleLogin = async (e) => {
    e.preventDefault()
    let payload = username+':'+password;//{username, password};
    try {
      let resp = await loginUser(dispatch, payload) //request + state changes in here
      if (!resp.user) return
      // props.history.push('/')
      history.replace('/')
    } catch (error) {
        console.log(error)
    }
  }
  
  return (
    <div>
      <h1>Login</h1>
      {
        errorMessage ? <p>{errorMessage}</p> : null
      }
      <form>
        <div>
          <label htmlFor='email'>username</label>
          <input type='text' 
                id='email'
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div>
          <label htmlFor='password'>password</label>
          <input type='password' 
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button onClick={handleLogin} disabled={loading}>login</button>
      </form>
    </div>
  )
}

// export default function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const token = sessionStorage.getItem("token");
//     const history = useHistory();

//     const userCtx = useContext(UserContext);

//     function handleClick ()  {

//       const opts = {
//         method: 'POST',
//         headers: new Headers({
//           "Authorization": `Basic ${btoa(`${username}:${password}`)}`
//         }),
//       }
//       fetch('/api/tokens', opts)
//         .then(res => {
//           if (res.status === 200) return res.json()
//           else return (<p>error</p>)
//         })
//         .then(data => {
//           userCtx.setToken(data.token);
//           sessionStorage.setItem("token", data.token);
//           userCtx.setId(data.user_id);
//           sessionStorage.setItem("user_id", data.user_id);
//           history.replace('/')
//         })
//         .catch(error =>{
//           console.error("error", error)
//         } )
//     }

//     return (
//       <div className="text-center" style = {{marginLeft: '20px'}}>
//         <h1>Login</h1> {/* maybe can also use onSubmit with form and useRef, and useHistory */}
//         {token && token!=="" && token!==undefined ? ("Currently logged in with token: " + token) : 
//           (<div>
//             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
//             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
//             <button onClick={handleClick}>Login</button>
//           </div>)
//         }
//       </div>
      
//     )
//   }