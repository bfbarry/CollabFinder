import React, { useEffect, useState } from 'react';
import {
    Link,
  } from "react-router-dom";
import moment from 'moment';
import ProjIcon from '../svg/ProjIcon';

export default function ResourcePreview(props) {
  /* Contains Name, Description, Project icon etc
  Iterated over on user profile and search page */

    return (
      <div>
        {props.res.items && props.res.items.map(p => (
          <div style = {{marginLeft: '20px'}}>
            <table className="table table-hover">
                <tr>
                    <td width="70px">
                      <a href={p.link}>{p.name}</a>
                    </td>
                </tr>
            </table>
  
          </div>
          )) 
        }
      </div>
    )
  }