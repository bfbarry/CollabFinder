import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjPreview from '../components/ProjPreview'

export default function SearchPage(props) {
  /* For now only searches projects */
  const {q} = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState({});
  
  useEffect(() => {
    fetch(`/api/search/${q}`)
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
  }, [q])

  return(
    <div>
      <ProjPreview projs={results}/>

    </div>

  )
}