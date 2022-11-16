import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
// import $ from "jquery";

//FAKE DATA
// const itemsFromBackend = [
//   {id: uuid(), content: 'First task'},
//   {id: uuid(), content: 'Second task'}
// ];

// const columnsFromBackend = 
//   {
//     [uuid()] : { //just getting a string key for our droppable
//       name: 'Requested',
//       items: itemsFromBackend
//     },
//     [uuid()] : { 
//       name: 'To do',
//       items: []
//     },
//     [uuid()] : { 
//       name: 'In Progress',
//       items: []
//     },
//     [uuid()] : { 
//       name: 'Done',
//       items: []
//     }
//   };

const onDragEnd = (result, columns, setColumns) => {
  // gets IDs from draggable items to keep track of them upon dragging
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1); //same as below
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId] : {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId] : {
        ...destColumn,
        items: destItems
      }
    })
  } 
  else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items]; // so as not to manipulate original state
    const [removed] = copiedItems.splice(source.index, 1); //splice items and remove from array
    copiedItems.splice(destination.index, 0, removed);
    setColumns({ //change the items
      ...columns, //current columns
      [source.droppableId] : {
        ...column,
        items: copiedItems
      }
    });
  }
};

function RmTask(props) {
  //only want to render if hovering over
  function handleRmTaskClick(e) {
    props.onClick(e);
  }

  return (
      <button 
        onClick={handleRmTaskClick}
        type="button"
        className="btn" 
        style={{
              // float: 'right',
                // padding:0,
                position:'absolute',
                top: 0.1,
                right: 0.1,
                }}>
            <span className="icon-archive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ff947a" width="16" height="16" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
            </span>
        </button>
  );
}

function Save(props) {
  return(
    <button 
    onClick={props.save}
    className='btn-lg btn-success'
    style={{float:'top'}}> Save Board </button>
  )
}

// function linkify(str) {
//     var newStr = str.replace(/(<a href=")?((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)))(">(.*)<\/a>)?/gi, function () {

//         return '<a href="' + arguments[2] + '">' + (arguments[7] || arguments[2]) + '</a>'
//     });
//     console.log(newStr)
//     $('task-div').html(newStr) //fill output area
    
// }

// function TaskText(props) {
//   return (
//     props.text
//     )
// }

function Task(props) {

  function handleRmTaskClick(e) {
    props.onRmClick(props.item.id);
  }

  return (
    <Draggable key={props.item.id} draggableId={props.item.id} index={props.index}>
    {(provided, snapshot) => {
      return (
        <div 
        id='task-div'
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          userSelect: 'none', //so not blue everywhere when dropping
          padding: 16,
          paddingTop: 25,
          margin: '0 0 8px 0',
          minHeight: '50px',
          backgroundColor: snapshot.isDragging ? '#d7f760' : '#edffab',
          color: 'black',
          wordWrap: 'break-word',
          position: 'relative',
          borderRadius: 12,
          ...provided.draggableProps.style
        }}>
          {props.item.content}
          {/* <TaskText
          text={this.props.item.content}
          /> */}

        <RmTask 
          index={props.index} 
          key={props.item.id} 
          onClick={handleRmTaskClick}/>
        </div>
      )
    }}
    </Draggable>
  )
  }
  

function Column(props) {
  /* Contains the task */
  //TODO: not sure if key in <Task/> is right

  function handleRmTaskClick(e) {
    //console.log(this.props.item.id);
    props.onRmTaskClick(e);
  } 

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h2>{props.column.name}</h2>
      <div style={{margin: 8}}>
        <Droppable key={props.id} droppableId={props.id}>
          {(provided, snapshot) => {
            return ( //ref is reference to inner DOM. innerRef relates dnd to react DOM
                    // ... unpacks props
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                  padding: 4,
                  width: 250,
                  minHeight: 500,
                  borderRadius: 12,
                }} >

                {props.column.items.map((item, index) => {
                  return (
                    <Task
                    key={index}
                    item={item}
                    index={index} 
                    onRmClick={handleRmTaskClick}/>
                  )
                })}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </div>
    </div>
    )
  }


function ScrumColumns(props) {
  //TODO: not sure if key in <Column/> is right

  function handleRmTaskClick(e) {
    props.onRmTaskClick(e);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }} >
      <DragDropContext onDragEnd={result => onDragEnd(result, props.columns, props.setColumns)}>
        {Object.entries(props.columns).map(([id, column]) => { //we want to iterate over our droppables (i.e. columns)
          return (
            <Column
            key={id}
            id={id}
            column={column}
            onRmTaskClick={handleRmTaskClick}/>
          )
        })}
      </DragDropContext>
    </div>
  )
  }


function AddTask(props) {
  
  function handleInputTextChange(e) {
    props.onInputTextChange(e.target.value);
  }

  function handleAddTaskClick(e) {
    props.onClick(e);
  }

  return (
    <div style={{
      className:'form-actions',
      textAlign: 'center',
      padding: 15,
      width: 210,
      height: 230,
      borderRadius: 10,
      margin: 20,
      marginTop: 100,
      float: 'left',
      backgroundColor: '#abd0ff',}}>
      <form>    
        <textarea name="textarea"
        type="text"
        value={props.inputText}
        onChange={handleInputTextChange}
        style={{
          resize: 'none',
          height:160,
        }}
        />
        <button 
        type="submit"
        className='btn btn-primary'
        onClick={handleAddTaskClick}
        >
        Add task
        </button>
        
      </form>
    </div>
    );
}

export default function ScrumBoard (props) {
  const [columns, setColumns] = useState({});
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/project/${props.id}/scrum`)
    .then(res => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        data = {'Requested': data['Requested'], 'To Do': data['To Do'],
               'In Progress':data['In Progress'], 'Done': data['Done']} //setting order
        let columnsFromBackend = {} //preparing for uuid format
        console.log(data);
        Object.keys(data).map((task_type) => {
          let items = []
          data[task_type].map((item) => {
            items.push({id: uuid(), content: item.text})
          })
          columnsFromBackend[uuid()] = {name: task_type, items: items}
        })
        setColumns(columnsFromBackend);
      },
      (error) => {
      setIsLoaded(true);
      setError(error);
      }
    )
  }, [props.id]) 
  
  function save(e) { 
    e.preventDefault();
    let payload = [];
    Object.keys(columns).map((colid) => {
      let task_type = columns[colid]['name'];
      columns[colid]['items'].map((item) => {
        payload.push({text: item.content, task_type: task_type});
      })
    })
    const opts = {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
        // "Authorization": `Bearer ${user.token}`
      }),
      body: JSON.stringify(payload)
    }
    fetch(`/api/project/${props.id}/update_scrum`, opts)
      .then(res => {
        if (res.status === 200) return res.json()
        else return (<p>error</p>)
      })
      .then(data => {
        console.log(true) //what to put here
        // history.replace(`/project/${data.id}`)
        })
      .catch(error => {
        console.error("error", error)
      } )
  }

  function setColumnsHandler(columns) {
    setColumns(columns);
  }

  function setInputTextHandler(inputText) {
    setInputText(inputText);
  }

  const handleAddTaskClick = e => {
    e.preventDefault(); //no page reload
    let new_task = inputText;
    let updated_cols = {...columns};
    let req_key;
    //Looping over json to find 'Requested', maybe not necessary with a good API
    for (var key in updated_cols) { 
      if (updated_cols[key]['name'] === 'Requested') {
        req_key = key;
        break;
      };
    }
    updated_cols[req_key]['items'].push({id: uuid(), content: new_task});

    setColumns(updated_cols);
    setInputText('');
  };


  const handleRmTaskClick = removeIndex => {
    // if (window.confirm("Confirm task deletion")) {
      let updated_cols = {...columns}; //very important! have to COPY it otherwise affects state directly!
      let rm_key;
      let item_ix;
      //same looping as for handleAddTaskClick()
      loop:
        for (var key in updated_cols) {
          for (var i = 0; i < updated_cols[key]['items'].length; i++) {
            if (updated_cols[key]['items'][i]['id'] === removeIndex) {
              rm_key = key;
              item_ix = i;
              break loop;
            }
            
          };
        }
      updated_cols[rm_key]['items'].splice(item_ix, 1)

      setColumns(updated_cols);
  // } 
  // else {}
    
  };

    return(
    <div>
      <AddTask 
        columns={columns} 
        inputText = {inputText}
        onInputTextChange={setInputTextHandler}
        onClick={handleAddTaskClick}/>

      <ScrumColumns
        columns={columns}
        setColumns={setColumnsHandler} 
        onRmTaskClick={handleRmTaskClick}/>

      <Save save={save}/>

    </div>
    );
}