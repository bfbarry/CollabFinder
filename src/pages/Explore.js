import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjPreview from '../components/ProjPreview'
import { useAuthState } from '../store/UserContext';

export default function Explore(props) {
  /* For now only searches projects */
  const user = useAuthState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState({});
  const [mode, setMode] = useState('recommended')
  const sort_options = ['recommended', 'recent'] //TODO
  const temp_cat_options = ['all', 'learning'] //TODO: these should come from API

  useEffect(() => {
    fetch(`/api/explore/projects/${user.user_id}/${mode}`)
    .then(res => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setResults(data);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
  }, [mode])

  return(
    <div>
      <div>
        <label htmlFor='category'> Sort by: </label>
        <select name='category'
              onChange={(e) => setMode(e.target.value)}
              value={mode}>
          {sort_options.map(opt => (
            <option key={opt} > {opt} </option>
          ))}
        </select> 

        <label htmlFor='category'> Category: </label>
        <select name='category'
              onChange={(e) => setMode(e.target.value)}
              value={mode}>
          {temp_cat_options.map(opt => (
            <option key={opt} > {opt} </option>
          ))}
        </select> 
      </div>
      <ProjPreview projs={results}/>
      
    </div>

  )
}