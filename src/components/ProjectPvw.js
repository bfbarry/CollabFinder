import React, { useEffect, useState } from 'react';
import {
    Link,
  } from "react-router-dom";
import moment from 'moment';
import ProjIcon from '../svg/ProjIcon';

export default function ProjPreview(props) {
  const [projs, setProjs] = useState({});
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    fetch(`/api/projects/${props.user_id}`)
     .then(res => res.json())
     .then(
       (data) => {
         setIsLoaded(true);
         setProjs(data);
       },
       (error) => {
         setIsLoaded(true);
         setError(error);
       }
     )
    }, [props.user_id])

    return (
      <div>
        {projs.items && projs.items.map(p => (
          <div style = {{marginLeft: '20px'}}>
            <table class="table table-hover">
                <tr>
                    <td width="70px">
                        <Link to={`/project/${p.id}`}>
                            <ProjIcon/>
                            {/* <img style={{width: '70px'}} alt='' src={require("../img/proj.jpg")} /> */}
                        </Link>
                    </td>
                    <td>
                        {/* <Link to={`/user/${props.user_id}`}>
                            { proj.creator }
                        </Link> */}
  
                        
                        <Link to={`/project/${p.id}`}>{p.name }</Link><br/>
                        <p>started {moment(p.timestamp).fromNow()}</p>
                        <p>{ p.descr }</p>
                    </td>
                </tr>
            </table>
  
          </div>
          )) 
        }
      </div>
    )
  }