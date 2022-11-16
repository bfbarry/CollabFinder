import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "../store/UserContext";

export default function ProjRequest(props){
  /* Mini form upon clicking on "Request to join project" or "Invite user" */

  const [inputText, setInputText] = useState('');
  const [requestedUser, setRequestedUser] = useState('');
  const user = useAuthState();
  const history = useHistory();
  const form_text = {
    request: 'Briefly explain why you would like to join the project',
    invite: 'Briefly explain why you would like to invite this member'}
  
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

    fetch(`/api/project/${props.id}/request`, opts)
      .then(res => {
        console.log(opts);
        if (res.status === 200) return res.json()
        else return (<p>error</p>)
      })
      .then(data => {
          props.onSuccess(`${data.system_message}`) // e.g., `${props.type} sent!`
          if (data.request_sent) { // if user.can_request()
            props.setProj(data)
          }
        })
      .catch(error => {
        console.error("error", error)
      } )  
  }

  return(
    <div className='modal1'>
      {props.type === 'invite' &&
        <input 
          type="text" 
          placeholder='enter username'
          onChange={(e) => setRequestedUser(e.target.value)}/>
      }
        <p>{form_text[props.type]} : </p>
        
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