import React, { useEffect, useState } from 'react';
import {
    Link,
    useHistory, useParams
  } from "react-router-dom";
import moment from 'moment';

export default function ProjPreview(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [proj, setProj] = useState([]);
    const {id} = props.proj_id;
  
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
    }, [])
  
    return (
      <div style = {{marginLeft: '20px'}}>
        <table class="table table-hover">
            <tr>
                <td width="70px">
                    <Link to={`/project/${id}`}>
                        <img style={{width: '70px'}} src="public/img/proj.jpg" />
                    </Link>
                </td>
                <td>
                    <Link to={`/user/${props.user_id}`}>
                        { proj.creator }
                    </Link>

                    {props.username} created a project {moment(proj.timestamp).fromNow()}
                    <Link to={`/project/${id}`}>{proj.name }</Link><br/>
                    { project.descr }
                </td>
            </tr>
        </table>

      </div>
      
    )
  }