import React, { useEffect, useState } from 'react';
import {
  Link,
  useParams
  } from "react-router-dom";
import { useAuthState } from '../store/UserContext';
import ProjRequest from '../components/ProjRequest';
import Notification from '../components/Notification';

export default function Notifications() {
  const user = useAuthState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    fetch(`/api/users/${user.user_id}/messages`)
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

  return (
    <div>
      {notifs.messages.map (m => (
        <Notification msg={m}/>
      ))}
      
    </div>
    )
}