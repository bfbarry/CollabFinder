import moment from "moment";
import { Link } from "react-router-dom";

export default function Notification(props) {
  return (
    <table class="table table-hover">
    <tr>
        {props.msg.kind === 'request' &&
        <td width="70px">
            <a href="{{ url_for('main.user', username=msg.user.username) }}">
                <img src="{{ msg.user.avatar(70) }}" />
            </a>
        </td>
        
        }
        {props.msg.kind === 'invite' &&
          <td width="70px">
              <a href="{{ url_for('main.project', project_id=msg.project_id) }}">
                  <img style='width: 70px', src="{{ url_for('static', filename='img/proj.jpg') }}" />
              </a>
          </td>
        
        }
        <td>
            
            
        {props.msg.kind === 'request' &&
          <p>
            <Link to={`/user/${props.msg.user_id}`}>
              {`${props.msg.user_id} `}
            </Link>
            <p>{`requests to join your project ${props.msg.project_id}: ${moment(props.msg.timestamp)}`}</p>
            
                 <br/>
            { props.msg.msg }
          </p>
        }

            

            {% if not proj_id_map[msg.project_id].is_member(msg.user_id) %}
            <!-- accept button -->
            <p>
                <form action="{{ url_for('main.accept', user_id=msg.user_id, project_id=msg.project_id) }}" method="post">
                    {{ form.hidden_tag() }}
                    {{ form.submit(value=_('Accept request'), class_='btn btn-success') }}
                </form>
            </p>
            {% else %}
            <p>
                <a class="btn btn" style="color:white;background-color:rgb(129, 129, 129);cursor:default;"> {{ _('Join request accepted.') }} </a>
            </p>
            {% endif %}

        {% elif msg.kind == 'invite' %}
            
            {{ _('Project %(project)s invited you to join their project: %(when)s',
                project=proj_link, when=moment(msg.timestamp).fromNow()) }} <br>
            {{ msg.msg }}

            {% if not proj_id_map[msg.project_id].is_member(msg.user_id) %}
            <!-- accept button -->
            <p>
                <form action="{{ url_for('main.accept', user_id=msg.user_id, project_id=msg.project_id) }}" method="post">
                    {{ form.hidden_tag() }}
                    {{ form.submit(value=_('Join Project'), class_='btn btn-success') }}
                </form>
            </p>
            {% else %}
            <p>      
                <a class="btn btn" style="color:white;background-color:rgb(129, 129, 129);cursor:default;"> {{ _('You joined the project.') }} </a>
            </p>  
            {% endif %}

        {% endif%}

        </td>
    </tr>
</table>
  )
  }