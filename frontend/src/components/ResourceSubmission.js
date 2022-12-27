import { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext'


export default function ProjRequest(props){
  /* Mini form upon clicking on "Request to join project" or "Invite user" */

  const [inputText, setInputText] = useState('');
  const [requestedUser, setRequestedUser] = useState('');
  const {user} = useAuthContext();

  function sendRequest(e) {
    e.preventDefault();
    let user_payload;
    if (props.type === 'request') {
      user_payload = user.user_id
    }
    else {
      user_payload = requestedUser;
    }
    const opts = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user.token}`
      }),
      body: JSON.stringify({
        'user': user_payload,
        'msg': inputText,
        'kind': props.type
      })
    }

    fetch(`/api/explore/resources/suggest`, opts)
      .then(res => {
        if (res.status === 200) return res.json()
        else return (<p>error</p>)
      })
      .then(data => {
          props.onClick(`${data.system_message}`) // e.g., succesfully sent
        })
      .catch(error => {
        console.error("error", error)
      } )  
  }

  return(
    <div className='modal1'>
      
        <p> Give this resource a name: </p>
        <input 
          type="text" 
          onChange={(e) => setRequestedUser(e.target.value)}/>
        <textarea name="textarea"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            resize: 'none',
            height:160,
            width:400,
          }}
          />
        <button 
          type='submit'
          className='btn btn-warning'
          style={{marginRight:50}}
          onClick={props.onCancel}
          >Cancel
        </button> 
        <button 
          type='submit'
          className='btn btn-primary'
          onClick={sendRequest}
          >Send
        </button>
    </div>
  )
}