import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useAuthState } from '../store/UserContext';
import '../App.css';

export default function CreateProject(props) {
  const user = useAuthState();
  const [form, setForm] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState({});
  const history = useHistory();

  console.log()
  useEffect(() => {
    fetch(`/api/forms/create_project`)
    .then(res => res.json())
    .then(
      (data) => {
      setIsLoaded(true);
      setForm(data);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
    }, [])
  
  function handleChange(e) {
    const {name, value} = e.target;
    setOutput(prevOutput => ({
      ...prevOutput,
      [name]: value
    }))
    console.log(output)
  }
  
  function submitHandler() {
    //post request
  }

  return ( //useref here?
    <form onSubmit={submitHandler}> 
      <div>
        <label htmlFor='name'> {form.name && form.name.label} </label> 
        <input type='text' 
              name='name'
              maxLength={form.name && form.name.maxlength}
              value={output.name || ''}
              onChange={handleChange}/> 
      </div>
      <div>
        <label htmlFor='category'> {form.category && form.category.label} </label>
        <select name='category'
              onChange={handleChange}
              value={output.category || ''}>
          {form.category && form.category.options.map(opt => (
            <option key={opt} > {opt} </option>
          ))}
        </select> 
      </div>
      <div >
        <label > {form.skill_level && form.skill_level.label} </label>
        {form.skill_level && form.skill_level.options.map(lvl => (

            <label htmlFor='skill_level' key={lvl + 'label'} > 
              <input type='radio' 
                    key={lvl}
                    name='skill_level'
                    value={lvl || ''}
                    onChange={handleChange}/>
                 {lvl} &nbsp;
              </label>
        ))}


      </div>
      

      {output.category === "learning" &&
        <div>
          <p >hello!</p>

        </div>
      }

    </form>
  )
}

