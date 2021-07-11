import moment from "moment";
import { Link } from "react-router-dom";
import ProjIcon from "../svg/ProjIcon";

export default function Notification(props) {

  function handleAcceptClick() {
    props.onAccept({project_id : props.msg.project_id,
                    user_id : props.msg.user_id});
  }

  return (
    <table className="table table-hover">
    <tr>
      {props.msg.kind === 'request' &&
      <td width="70px">
        <a href="{{ url_for('main.user', username=msg.user.username) }}">
          <ProjIcon/>
        </a>
      </td>
      
      }
      {props.msg.kind === 'invite' &&
        <td width="70px">
          <a href="{{ url_for('main.project', project_id=msg.project_id) }}">
            <ProjIcon/>
          </a>
        </td>
      
      }
      <td>
        
        
      {props.msg.kind === 'request' &&
        <div>
        <Link to={`/user/${props.msg.user_id}`}>
          {`${props.msg.username && props.msg.username} `}
        </Link>
          {`requests to join your project ${props.msg.project_id}: ${moment(props.msg.timestamp).fromNow()}`}
        
          <br/>
        { props.msg.msg }
        
        { !props.msg.members.includes(props.msg.user_id) ? 
          ( <p>
                <button className='btn btn-success' onClick={() => handleAcceptClick()}>Accept request</button>
            </p>)
            : (

            <p>
              <button className="btn btn" style={{color:'white',backgroundColor:'rgb(129, 129, 129)',cursor:'default'}}> Join request accepted. </button>
            </p>
            )

          }
        </div>
      }


      {props.msg.kind === 'invite' &&
        <div>
          <Link to={`/project/${props.msg.project_id}`}>
          {`${props.msg.projectname && props.msg.projectname} `}
        </Link>
          {`invited you to join their project ${props.msg.project_id}: ${moment(props.msg.timestamp).fromNow()}`}
        
          <br/>
        { props.msg.msg }
        

        { !props.msg.members.includes(props.msg.user_id) ? 
          ( <p>
              <button className='btn btn-success' onClick={() => handleAcceptClick()}>Join project</button>
            </p>)
            : (

            <p>
              <button className="btn btn" style={{color:'white',backgroundColor:'rgb(129, 129, 129)',cursor:'default'}}> You joined the project. </button>
            </p>
            )

          }

        </div>
      }
        


      </td>
    </tr>
  </table>
  )
  }