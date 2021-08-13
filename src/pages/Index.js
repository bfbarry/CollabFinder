import { rgbToHex } from '@material-ui/core';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function Index() {
  /* For now contains jumbotron to search or create project */
  const [searchq, setSearchq] = useState('')
  const history = useHistory();
  
  function submitHandler(e) {
    e.preventDefault();
    history.replace(`/search/${searchq}`)

  }
  return(
    <div>

      <br/><br/>
      <div className="go_center fpage_div jumbotron" id="grad2">
      <form className="navbar-form" method="get"
          onSubmit={submitHandler}
          >
        <Link className="btn btn-lg" to="/explore" role="button" style={{color:'white',backgroundColor:'rgb(238,135,245',height:'50px',width:'275px',marginBottom:'10px'}}>Explore projects</Link><br/>
        <p>or...</p>

        <input className="form-group"
          placeholder="Search for a project"
          type='text' 
          id='email'
          value={searchq}
          onChange={(e) => setSearchq(e.target.value)}
          style={{marginRight:10}}>
        </input>
        <input type="submit" style={{display: "none"}} />
          <button className="btn btn-lg" type="submit" style={{color:'white',backgroundColor:'#ff56ff'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg></button>
          </form>

        <p>or...</p>

        <Link className="btn btn-lg" to="/create_project" role="button" style={{color:'white',backgroundColor:'#5683ff',height:'50px',width:'275px'}}>Start a project</Link>
      </div>
    </div>
  )
}