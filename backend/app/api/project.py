from datetime import datetime
from flask import request, g, jsonify
from flask_babel import _, get_locale
from guess_language import guess_language
from app import db
from app.main.forms import SearchForm, EditProfileForm, EmptyForm, ProjectForm, TestForm, EditProjectForm, RequestForm
from app.models import User, Project, ProjMember, JoinRequest, ScrumTask, Tag, Position, proj_categories, \
                            Learning #Project subclasses
from app.api import bp
import json
from app.api.auth import token_auth

# @bp.before_app_request
# def before_request():
#     if current_user.is_authenticated:
#         current_user.last_seen = datetime.utcnow()
#         db.session.commit()
#         g.search_form = SearchForm() # g variable is specific to each request and each client
#     g.locale = str(get_locale())

### HELPER FUNC
def validate_name(self, name, case='new proj'):
    if name.data != self.original_name or case == 'new proj':
        project = Project.query.filter_by(name=self.name.data).first()
        if project is not None:
            raise ValidationError(_('This particular project name is already taken.'))

def validate_username(self, username):
    if username.data != self.original_username:
        user = User.query.filter_by(username=self.username.data).first()
        if user is not None:
            raise ValidationError(_('Please use a different username.'))
###

@bp.route('/project/<int:id>', methods=['GET'])
def get_project(id):
    return jsonify(Project.query.get_or_404(id).to_dict())

@bp.route('/projects', methods=['GET'])
def get_projects(q=None):
    """If invoked within User.to_dict(), passes in q as all a user's projects"""
    if q is None:
        q=Project.query
    page = request.args.get('page',1,type=int)
    
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = Project.to_collection_dict(q, page, per_page, 'api.get_projects')
    return jsonify(data)

@bp.route('/project/create', methods=['POST'])
@token_auth.login_required
def create_project():
    input_data = request.get_json()
    user_id = token_auth.current_user().id
    user = User.query.get_or_404(user_id)
    input_data['creator'] = user
    category = input_data.get("category")
    project = proj_categories[category]()
    project.from_dict(input_data)
    db.session.add(project)
    db.session.commit() 

    membership = ProjMember(user_id=user_id, project_id = project.id, rank_id=3,position_id=None)
    user.member_of.append(membership)
    db.session.commit()

    return jsonify(project.to_dict())

@bp.route('/project/<int:id>/update', methods=['PUT'])
@token_auth.login_required
def update_project(id):
    # if token_auth.current_user().id not in project.members: 
    #         abort(403)
    proj = Project.query.get_or_404(id)
    input_data = request.get_json()
    
    tag_names, pos_names  = [t.name for t in Tag.query.all()], [p.name for p in Position.query.all()]
    # TODO Check if user has perms
    # TODO add from_dict() for specific sub classes
    proj.from_dict(input_data)
    
    for tag in input_data['tags']:
        tag = tag.lower()
        if tag not in tag_names:
            db.session.add(Tag(name=tag))
            db.session.commit() #redundant?
        
    for pos in input_data['wanted_positions']:
        pos = pos.lower()
        if pos not in pos_names:
            db.session.add(Position(name=pos))
            db.session.commit()

    db.session.commit()

    return jsonify(proj.to_dict()) 

@bp.route('/project/<int:id>/scrum/', methods=['GET'])
def get_scrum(id):
    return jsonify(Project.query.get_or_404(id).scrum_to_dict())

@bp.route('/project/<int:id>/update_scrum/', methods=['GET'])
# @token_auth.login_required
def update_scrum(id):
    """input_data not same format as get_scrum!"""
    input_data = request.get_json()
    proj = Project.query.get_or_404(id)
    orig_tasks = [{task.text:task.id} for task in proj.scrum_board.all()]
    for text, id in orig_tasks:
        if text not in [t.get('text') for t in input_data]:
            db.session.delete(ScrumTask.query.get_or_404(id))
    for t in input_data:
        if t.get('text') not in orig_tasks: #avoid redundant tasks
            task = ScrumTask(project_id=id, 
                            user_id=input_data.get('user_id'),
                            text=input_data.get('text'),
                            task_type=input_data.get('task_type'))
            db.session.add(task)
    db.session.commit()
    return jsonify(Project.query.get_or_404(id).scrum_to_dict())

@bp.route('/project/<int:id>/request/', methods=['GET', 'POST'])
# @token_auth.login_required
def request_project(id):
    ''' 
    endpoint for both sending request and sending invitation 
    u_inv a username string
    '''
    input_data = request.get_json()
    proj = Project.query.get_or_404(id) 
    u = User.query.filter_by(input_data.get('username')).first_or_404()

    if input_data.get('kind') == 'invite':
        r = JoinRequest(kind='invite',msg=input_data.get('msg'),status='pending')
        r.project = proj
        r.user = u
        u.send_request(proj,r,kind='invite',u_inv=u) # works like invited user is sending request to themselves
        db.session.commit()
    elif input_data.get('kind') == 'request':
        r = JoinRequest(kind='request',msg=input_data.get('msg'),status='pending')
        r.project = proj
        r.user = u
        u.send_request(proj,r)
        db.session.commit()
        
    return jsonify(r)

@bp.route('/project/<int:id>/cancel_request', methods=['POST'])
# @token_auth.login_required
def cancel_request(id):
    proj = Project.query.get_or_404(id)
    ...

@bp.route('/project/<int:id>/delete', methods=['POST'])
# @token_auth.login_required
def delete_project(id):
    ...