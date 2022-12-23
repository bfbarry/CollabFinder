import React, { useEffect, useState } from 'react';
import ProjPreview from '../components/ProjPreview'
import { useAuthState } from '../store/UserContext';
import {Link} from 'react-router-dom';

export default function Explore(props) {
  /* For now only searches projects */
  const user = useAuthState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState({});
  const sort_options = ['recommended', 'recent'] //TODO
  const [mode, setMode] = useState(sort_options[0])
  const [cat, setCat] = useState('all')

  useEffect(() => {
    fetch(`/api/explore/projects/${user.user_id}/${mode}/${cat}`)
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
  }, [mode, cat])

  return(
    <div>
      <div style={{width: 500, left: '50%',marginLeft: '-300px',position: 'relative', textAlign: 'center', display: 'inline-block'}}>
        <Link to='/explore/resources' className='btn btn-primary btn-block'>Explore Project Resources</Link>
      </div>
      <div style={{margin: '20px'}}>
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
              onChange={(e) => setCat(e.target.value)}
              value={cat}>
          {results._meta && results._meta.categories.map(opt => (
            <option key={opt} > {opt} </option>
          ))}
        </select> 
      </div>
      <ProjPreview projs={results}/>
      
    </div>

  )
}