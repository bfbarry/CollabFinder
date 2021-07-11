import React, { useEffect, useState } from 'react';
import {
  Link,
  useParams
  } from "react-router-dom";
import { useAuthState } from '../store/UserContext';
import ProjRequest from '../components/ProjRequest';
import Notification from '../components/Notification';
import { deprecationHandler } from 'moment';

export default function Notifications() {
  const user = useAuthState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const {id} = useParams();

  useEffect(() => {
    fetch(`/api/users/${id}/messages`) //need header
    .then(res => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setNotifs(data);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
  }, [id])

  function handleAccept(payload) {
    const opts = {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
        // "Authorization": `Bearer ${user.token}`
      }),
      body: JSON.stringify(payload)
    }
    fetch(`/api/user/${id}/handle_proj_request`, opts)
      .then(res => {
        if (res.status === 200) return res.json()
        else return (<p>error</p>)
      })
      .then(data => {
        setNotifs(data)
        })
      .catch(error => {
        console.error("error", error)
      } )

  }
  return (
    <div>
      {notifs.items && notifs.items.map (m => (
        <Notification msg={m} onAccept={handleAccept} key={m.timestamp}/>
      ))}
      
    </div>
    )
}