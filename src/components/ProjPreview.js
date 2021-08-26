import React, { useEffect, useState } from 'react';
import {
    Link,
  } from "react-router-dom";
import moment from 'moment';
import ProjIcon from '../svg/ProjIcon';

export default function ProjPreview(props) {
  /* Contains Name, Description, Project icon etc
  Iterated over on user profile and search page */

    return (
      <div>
        {props.projs.items && props.projs.items.map(p => (
          <div style = {{marginLeft: '20px'}}>
            <table className="table table-hover">
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
                        <Link to={`/project/${p.id}`}>{p.name }</Link>
                        <Link to={`/search/${p.category}`} className="btn btn-sm" style={{color:'white', backgroundColor:'rgb(98, 199, 101)', marginLeft:'5px'}}> {p.category}</Link><br/>
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