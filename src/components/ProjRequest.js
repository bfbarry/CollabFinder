import { useState } from "react";
import { useAuthState } from "../store/UserContext";

export default function ProjRequest(props){
  const [inputText, setInputText] = useState('');
  const user = useAuthState();
  const form_text = {
    request: 'Briefly explain why you would like to join the project',
    invite: 'Briefly explain why you would like to invite this member'}
  
  function sendRequest(e) {
    e.preventDefault();
    const opts = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user.token}`
      }),
      body: JSON.stringify({
        'username': user.id,
        'text': inputText
      })
    }
    fetch(`/api/project/${props.id}/request`, opts)
      .then(res => {
        if (res.status === 200) return res.json()
        else return (<p>error</p>)
      })
      .then(data => {
        console.log()
        // props.setSuccess(`${props.type} sent!`)
        })
      .catch(error => {
        console.error("error", error)
      } )  
  }

  return(
    <div className='modal1'>
      {/* <form> */}
      {props.type === 'invite' &&
        <input type="text" placeholder='enter username'/>
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
      {/* </form> */}
    </div>
  )
}