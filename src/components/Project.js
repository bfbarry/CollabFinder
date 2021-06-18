import React, { useEffect, useState } from 'react';
import {
    useHistory, useParams
  } from "react-router-dom";

export default function Project() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [project, setProject] = useState([]);
    const {id} = useParams();
  
    useEffect(() => {
      fetch(`/api/project/${id}`)
        .then(res => res.json())
        .then(
          (data) => {
            setIsLoaded(true);
            setProject(data);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [])
  
    return (
      <div>
        <h1>{project.name}</h1>
        <p>{project.descr}</p>
      </div>
      
    )
  }