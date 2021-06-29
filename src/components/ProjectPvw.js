import React, { useEffect, useState } from 'react';
import {
    Link,
    useHistory, useParams
  } from "react-router-dom";
import moment from 'moment';

export default function ProjPreview(props) {
  
    return (
      <div style = {{marginLeft: '20px'}}>
        <table class="table table-hover">
            <tr>
                <td width="70px">
                    <Link to={`/project/${props.id}`}>
                        <img style={{width: '70px'}} src={require("../img/proj.jpg")} />
                    </Link>
                </td>
                <td>
                    {/* <Link to={`/user/${props.user_id}`}>
                        { proj.creator }
                    </Link> */}

                    
                    <Link to={`/project/${props.id}`}>{props.name }</Link><br/>
                    <p>started {moment(props.timestamp).fromNow()}</p>
                    <p>{ props.descr }</p>
                </td>
            </tr>
        </table>

      </div>
      
    )
  }