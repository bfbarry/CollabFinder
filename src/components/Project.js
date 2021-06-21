import React, { useEffect, useState } from 'react';
import {
    Link,
    useHistory, useParams
  } from "react-router-dom";
import moment from 'moment';

export default function Project() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [proj, setProj] = useState([]);
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
    }, [])
  
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
                    <Link to={`search?q=${tag}`} class="btn btn-sm" style={{color:'white', backgroundColor:'rgb(98, 199, 101)', marginLeft:'5px'}}> {tag}</Link>
                ))}
            </ul></div>
            
        }

        { proj.wanted_positions && proj.wanted_positions.length > 0 &&
            <div>
            <b>wanted positions:</b>
            <ul>
                {proj.wanted_positions.map (pos => (
                    <Link to={`search?q=${pos}`} class="btn btn-sm" style={{color:'white', backgroundColor:'rgb(140, 98, 199)', marginLeft:'5px'}}> {pos}</Link>
                ))}
            </ul></div>
            
        }

        <p>{proj.setting} setting - for those at {proj.skill_level} skill level</p>
        {proj._links && proj._links.chat_link  &&
            <div>
                <p>Join the conversation:</p> 
                <a class="btn btn-info" href={`http://${proj._links.chat_link}`}> 
                {proj._links.chat_link} 
                </a>
            </div>
        }    
        {/*later check if member not creator */}
        {proj.category == 'learning' &&
            <div id = 'learning'>
                <p><b>Pace: </b>Learning at a {proj.pace} pace</p>
                {proj.resource &&
                    <p> <b>Resources: </b>using {proj.resource}</p>
                }
            </div>
        }
        { proj.category == 'software development' &&
            <div id = 'software'>
                Hello
            </div>
        }
        
        {/* {% if current_user == proj.creator %}
            <a href="{{ url_for('main.edit_project', project_id=proj.id) }}" method='post' class="btn btn" style="color:white;background-color:turquoise;"> {{_('edit project details')}} </a>
                <br><br>
            <a href="{{ url_for('main.request_project', project_id=proj.id, kind='invite') }}"  method='post' class="btn btn" style="color:white;background-color:purple;"> + {{ _('invite user') }} </a>

        {% elif current_user.can_request(proj) %}
            <a href="{{ url_for('main.request_project', project_id=proj.id, kind='request') }}"  method='post' class="btn btn" style="color:white;background-color:purple;"> + {{ _('request to join project') }} </a>
        {% elif not current_user.can_request(proj) and not proj.is_member(current_user.id) %}
            <a class="btn btn" style="color:white;background-color:rgb(129, 129, 129);cursor:default;"> + {{ _('Request pending') }} </a>
        {% endif %} */}
      </div>
      
    )
  }