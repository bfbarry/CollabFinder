import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "../store/UserContext";

export default function ProjRequest(props){
  const [inputText, setInputText] = useState('');
  const user = useAuthState();
  const history = useHistory();
  const form_text = {
    request: 'Briefly explain why you would like to join the project',
    invite: 'Briefly explain why you would like to invite this member'}
  
  function sendRequest(e) {
    e.preventDefault();
    let d;
    const opts = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user.token}`
      }),
      body: JSON.stringify({
        'user': user.user_id,
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
        console.log('HELLO!')
        // history.replace(`/project/${props.id}`)
        props.onSuccess(props.type) //`${props.type} sent!`
        props.setProj(data)
        d = data;
        })
      .catch(error => {
        console.error("error", error)
      } )  
      // props.onSuccess() //`${props.type} sent!`
      // props.setProj(d)
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