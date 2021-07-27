import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjPreview from '../components/ProjPreview'

export default function Explore(props) {
  /* For now only searches projects */
  const {q} = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState({});
  const [mode, setMode] = useState('all')
  const temp_cat_options = ['all', 'learning'] //TODO

  useEffect(() => {
    fetch(`/api/projects/${mode}`)
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
        <label htmlFor='category'> Category: </label>
        <select name='category'
              onChange={(e) => setMode(e.target.value)}
              value={mode}>
          {temp_cat_options.map(opt => (
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