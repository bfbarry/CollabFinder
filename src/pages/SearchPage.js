import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SearchPage(props) {
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
      {/* <h1>{{ _('Search Results') }}</h1>
      {% for project in projects %}
        {% include '_proj_pvw.html' %}
      {% endfor %}
      <nav aria-label="...">
        <ul class="pager">
          <li class="previous{% if not prev_url %} disabled{% endif %}">
            <a href="{{ prev_url or '#' }}">
              <span aria-hidden="true">&larr;</span>
              {{ _('Previous results') }}
            </a>
          </li>
          <li class="next{% if not next_url %} disabled{% endif %}">
            <a href="{{ next_url or '#' }}">
              {{ _('Next results') }}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
        </ul>
      </nav> */}
      <pre>{JSON.stringify(results)}</pre>

    </div>

  )
}