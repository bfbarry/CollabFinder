import React, { useState, useEffect } from "react";
import {
  useParams
  } from "react-router-dom";

export default function User() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState({});
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
                
                {/* edit profile */}
                
                {/* follow/unfollow buttons */}
                
            </td>
            </tr>
        </table>
        <hr/>
    </div>
    
    )
 }       
}