import React, { useEffect, useState } from 'react';
import {
  Link,
  useParams
  } from "react-router-dom";
import moment from 'moment';
import { useAuthState } from '../store/UserContext';
import ScrumBoard from '../components/ScrumBoard';
import ProjRequest from '../components/ProjRequest';
import BackDrop from '../components/BackDrop';

export default function Project() {
  const user = useAuthState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [proj, setProj] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false); //success div
  const {id} = useParams();
  
  useEffect(() => {
    fetch(`/api/project/${id}`)
    .then(res => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setProj(data);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
  }, [id]) //should id be passed in here?

  function showReqSuccess(kind) {
    // e.preventDefault();
    setShowRequest(false);
    setReqSuccess(kind);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
    return <div>Loading...</div>;
    } else {
  return (
    <div style = {{marginLeft: '20px'}}>
      <h1 style={{float: 'left'}}>{ proj.name }</h1> 
      <p style= {{whiteSpace: 'nowrap', overflow: 'hidden', color: '#949494'}}> &nbsp; started by {proj.creator}, {moment(proj.timestamp).fromNow()} </p>
      <br/><h3> A {proj.category} project.</h3>
      <p>{proj.descr}</p>
      { proj.tags && proj.tags.length > 0 &&
        <div>
        <b>tags:</b>
        <ul>
          {proj.tags.map (tag => (
            <Link to={`/search?q=${tag}`} className="btn btn-sm" style={{color:'white', backgroundColor:'rgb(98, 199, 101)', marginLeft:'5px'}}> {tag}</Link>
          ))}
        </ul></div>
        
      }

      {/* MAPPINGS NEED KEYS! */}
      { proj.wanted_positions && proj.wanted_positions.length > 0 &&
        <div>
        <b>wanted positions:</b>
        <ul>
          {proj.wanted_positions.map (pos => (
            <Link to={`/search?q=${pos}`} className="btn btn-sm" style={{color:'white', backgroundColor:'rgb(140, 98, 199)', marginLeft:'5px'}}> {pos}</Link>
          ))}
        </ul></div>
        
      }

      <p>{proj.setting} setting - for those at {proj.skill_level} skill level</p>
      {proj._links && proj._links.chat_link  &&
        <div>
          <p>Join the conversation:</p> 
          <a className="btn btn-info" href={`http://${proj._links.chat_link}`}> 
          {proj._links.chat_link} 
          </a>
        </div>
      }  
      {/*later check if member not creator */}
      {proj.category === 'learning' &&
        <div>
          <p><b>Pace: </b>Learning at a {proj.pace} pace</p>
          {proj.resource &&
            <p> <b>Resources: </b>using {proj.resource}</p>
          }
        </div>
      }
      { proj.category === 'software development' &&
        <div>
          Hello
        </div>
      }
      {/* ADMIN PRIV */}
      {proj.members && Object.keys(proj.members).includes(String(user.user_id)) &&
        <div>
          <Link to={`/project/${id}/update`}
            className="btn btn"
            style={{color:'white',backgroundColor:'turquoise'}}> edit project details </Link>
            <br/><br/>
          <button
          onClick={() => setShowRequest('invite')}
          className="btn btn" 
          style={{color:'white',backgroundColor:'purple'}}> 
          + invite user </button>
        </div>
      }

      {proj.members && !Object.keys(proj.members).includes(String(user.user_id)) && !Object.keys(proj.requests).includes(String(user.user_id)) &&
      
        <button
        onClick={() => setShowRequest('request')}
          className="btn btn" 
          style={{color:'white',backgroundColor:'purple'}}> request to join project </button>
      }
        
      {proj.requests && Object.keys(proj.requests).includes(String(user.user_id)) &&

        <button className="btn btn" 
        style={{color:'white',backgroundColor:'rgb(129, 129, 129)',cursor:'default'}}> + Request pending</button>
      }

      {showRequest &&
        <div>
          <BackDrop/>
          <ProjRequest id={id} 
          type={showRequest} 
          onCancel={() => setShowRequest(false)} 
          onSuccess={showReqSuccess}
          setProj={setProj}/>

        </div>
      }

      {reqSuccess &&
        <div>
          <BackDrop onClick={()=>setReqSuccess(false)}/>
          <div className='modal1'>{reqSuccess} sent!</div>
        </div>

      }


      <ScrumBoard id={id}/>
    </div>
    
  ) 
  }
  }