import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading} = useLogin()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    await login(username, password)
    if (!error) {
      navigate('/')
    }
  }
  
  return (
    <div>
      <h1>Login</h1>
      {
        error ? <p>{error}</p> : null
      }
      <form>
        <div>
          <label >username</label>
          <input type='text'
                className='ring-2 ring-blue-500' 
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div>
          <label>password</label>
          <input type='password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button onClick={handleLogin} disabled={isLoading}>login</button>
      </form>
    </div>
  )
}

// export default function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const token = sessionStorage.getItem("token");
//     const navigate = useNavigate();

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
//           navigate('/')
//         })
//         .catch(error =>{
//           console.error("error", error)
//         } )
//     }

//     return (
//       <div className="text-center" style = {{marginLeft: '20px'}}>
//         <h1>Login</h1> {/* maybe can also use onSubmit with form and useRef, and useNavigate */}
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