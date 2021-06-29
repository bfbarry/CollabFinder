import React, { useEffect, useState } from 'react';
import {useParams, useHistory} from 'react-router-dom';
import { useAuthState } from '../store/UserContext';
import {Autocomplete} from '@material-ui/lab';
import {TextField} from '@material-ui/core';
import '../App.css';

export default function CreateProject(props) {
  const user = useAuthState();
  const {id} = useParams();
  const [form, setForm] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState({});
  const history = useHistory();
  const unwanted_attr = ['creator'];

  useEffect(() => {
    fetch(`/api/project/${id}`)
    .then(res => res.json())
    .then(
      (data) => {
      setIsLoaded(true);
      setOutput(data);
      if (data.members[user.user_id].rank !== "Admin") {
        history.replace('/')
      
      
      }
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
    }, [id, user.user_id])

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
    // console.log(output)
  }
  
  async function submitHandler(e) {
    // post request
    e.preventDefault()
    unwanted_attr.map(a => delete output[a])
    const opts = {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user.token}`
      }),
      body: JSON.stringify(output)
    }
    fetch(`/api/project/${id}/update`, opts)
      .then(res => {
        if (res.status === 200) return res.json()
        else return (<p>error</p>)
      })
      .then(data => {
        history.replace(`/project/${data.id}`)
        })
      .catch(error => {
        console.error("error", error)
      } )
  }

  return ( //useref here?
    <div > 
    {/* onSubmit={submitHandler}  */}
      <div>
        <label htmlFor='name'> {form.name && form.name.label} </label> 
        <input type='text' 
              name='name'
              maxLength={form.name && form.name.maxlength}
              value={output.name || ''}
              onChange={handleChange}/> 
      </div>
      <div>
        <label htmlFor='descr'> {form.descr && form.descr.label} </label> 
        <textarea name='descr'
              maxLength={form.descr && form.descr.maxlength}
              value={output.descr || ''}
              onChange={handleChange}/> 
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
      <div >
        <label > {form.setting && form.setting.label} </label>
        {form.setting && form.setting.options.map(stg => (

            <label htmlFor='setting' key={stg + 'label'} > 
              <input type='radio' 
                    key={stg}
                    name='setting'
                    value={stg || ''}
                    onChange={handleChange}/>
                 {stg} &nbsp;
              </label>
        ))}
      </div>
      <div >
        <label > {form.geo_type && form.geo_type.label} </label>
        {form.geo_type && form.geo_type.options.map(gt => (

            <label htmlFor='geo_type' key={gt + 'label'} > 
              <input type='radio' 
                    key={gt}
                    name='geo_type'
                    value={gt || ''}
                    onChange={handleChange}/>
                 {gt} &nbsp;
              </label>
        ))}
      </div>
      {output.geo_type === 'college/university' &&
        <Autocomplete
          id="college"
          options={form.college && form.college.options}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} 
            label="Enter and select college/university" 
            variant="outlined" 
            name='college'
            value={output.college || ''}
            onChange={handleChange}/>} // This no work
        />
      }
      

      {output.category === "learning" &&
        <div>
          <div>
            <label htmlFor='learning_category'> {form.learning_category && form.learning_category.label} </label>
            <select name='learning_category'
                  onChange={handleChange}
                  value={output.learning_category || ''}>
              {form.learning_category && form.learning_category.options.map(opt => (
                <option key={opt} > {opt} </option>
              ))}
            </select> 
          </div>
          <div>
            <label htmlFor='pace'> {form.pace && form.pace.label} </label>
            <select name='pace'
                  onChange={handleChange}
                  value={output.pace || ''}>
              {form.pace && form.pace.options.map(opt => (
                <option key={opt} > {opt} </option>
              ))}
            </select> 
          </div>
          <div>
            <label htmlFor='resource'> {form.resource && form.resource.label} </label> 
            <input type='text' 
                  name='resource'
                  maxLength={form.resource && form.resource.maxlength}
                  value={output.resource || ''}
                  onChange={handleChange}/> 
          </div>

        </div>
      }
    <button className='btn-lg btn-success' onClick={submitHandler}>update project details</button>
    </div>
  )
}

