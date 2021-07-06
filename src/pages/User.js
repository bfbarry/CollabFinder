import React, { useState, useEffect } from "react";
import {
  useParams
  } from "react-router-dom";
import { useAuthState } from '../store/UserContext'
import ProjPreview from '../components/ProjPreview'

export default function User() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState({});
  //project previews
  const [projs, setProjs] = useState({});
  const [projerror, setProjError] = useState(null);
  const [projisLoaded, setProjIsLoaded] = useState(false);
  const currentUser = useAuthState();
  
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

  // function next() {
  //   return next link for project list
  // }

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
              <img src={user._links && user._links.avatar} alt=""/>
          </td>
          <td>
              <h1>User: {user.username}</h1>
              { user.about_me != null &&
              <div>
                  <p>About me: </p>
                  <p>{user.about_me}</p>
              </div>
              }

              <p>{user.project_count} projects </p>
              {currentUser.user_id == id && /* eslint eqeqeq: 0 */

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