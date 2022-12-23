import React, { useState, useEffect } from "react";
import {
  useParams
  } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'
import ProjPreview from '../components/ProjPreview'

export default function User() {
  /* Displays 'about me', projects user is part of
  Want follow functionality? */

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [curr_user, setUser] = useState({});
  //project previews
  const [projs, setProjs] = useState({});
  const [projerror, setProjError] = useState(null);
  const [projisLoaded, setProjIsLoaded] = useState(false);
  const { user } = useAuthContext;
  
  const {id} = useParams();

  useEffect(() => {
      fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setUser(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [id])

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(
        (data) => {
          setProjIsLoaded(true);
          setProjs(data);
        },
        (error) => {
          setProjIsLoaded(true);
          setProjError(error);
        }
      )
    }, [id])


  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
  return (
  <div> 
      <table>
          <tr valign="top">
          <td>
              <img src={curr_user._links && curr_user._links.avatar} alt=""/>
          </td>
          <td>
              <h1>User: {curr_user.username}</h1>
              { curr_user.about_me != null &&
              <div>
                  <p>About me: </p>
                  <p>{curr_user.about_me}</p>
              </div>
              }

              <p>{curr_user.project_count} projects </p>
              {curr_user.user_id == id && /* eslint eqeqeq: 0 */

                <button> Edit profile </button>
              }
              
              {/* follow/unfollow buttons */}
              
          </td>
          </tr>
      </table>
      <hr/>
      <h2> Projects </h2>
      <div>
          <ProjPreview projs={projs}/>
      </div>
  </div>
  
  )
}       
}