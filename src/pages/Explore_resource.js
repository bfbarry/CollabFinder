import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ResourcePreview from '../components/ResourcePreview'
import { useAuthState } from '../store/UserContext';
import {Link} from 'react-router-dom'
import BackDrop from '../components/BackDrop';
import ResourceSubmission from '../components/ResourceSubmission'

export default function ExploreResource(props) {
  /* For now only searches projects */
  const user = useAuthState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState({});
  const sort_options = ['recommended', 'recent'] //TODO
  const [mode, setMode] = useState(sort_options[1])
  const [cat, setCat] = useState('all')

  const [showSubmission, setShowSubmission] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/explore/resources/${user.user_id}/${mode}/${cat}`)
    .then(res => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setResults(data);
        console.log(results);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
  }, [mode, cat])

  return(
    <div>
      <div style={{margin: '20px'}}>
      <div style={{width: 500, left: '50%',marginLeft: '-300px',position: 'relative', textAlign: 'center', display: 'inline-block'}}>
        <Link to='/explore/projects' className='btn btn-primary btn-block'>Explore Projects</Link>
      </div>
      <button onClick={() => setShowSubmission(true)}>
        Suggest a resource 
      </button>

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
      <ResourcePreview res={results}/>
      
      {showSubmission &&
        <div>
          <BackDrop/>
          <ResourceSubmission 
          onCancel={() => setShowSubmission(false)} 
          onClick={() => setSubSuccess(true)}
          />

        </div>
      }

      {subSuccess &&
        <div>
          <BackDrop onClick={()=>setSubSuccess(false)}/>
          <div className='modal1'> {subSuccess} </div>
        </div>

      }

    </div>

  )
}