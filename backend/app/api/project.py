from datetime import datetime
from flask import request, g, jsonify
from flask_babel import _
from app import db
from app.models import User, Project, ProjMember, JoinRequest, ScrumTask, Tag, Position, PROJ_CATEGORIES, \
                            Learning #Project subclasses
from app.api import bp
from app.api.auth import token_auth
from ..utils import api_func

# @bp.before_app_request
# def before_request():
#     if current_user.is_authenticated:
#         current_user.last_seen = datetime.utcnow()
#         db.session.commit()
#         g.search_form = SearchForm() # g variable is specific to each request and each client
#     g.locale = str(get_locale())

###TODO HELPER FUNC (unused and not API oriented yet)
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

@bp.route('/projects/<_q>', methods=['GET'])
def get_projects(_q):
    """If invoked within User.to_dict(), passes in q as all a user's projects"""

    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)

    if _q == 'all':
        q = Project.query.order_by(Project.timestamp.desc())
    elif _q.isdigit(): # User's projects
        ids = [p.project_id for p in ProjMember.query.filter_by(user_id=_q)]
        q = Project.query.filter(Project.id.in_(ids)).order_by(Project.timestamp.desc())#.all()

    data = Project.to_collection_dict(q, page, per_page, 'api.get_projects', _q=_q) 
    return jsonify(data)

@bp.route('/project/create', methods=['POST'])
@token_auth.login_required
def create_project():
    """Data from Create Project form"""
    input_data = request.get_json()
    user_id = token_auth.current_user().id
    user = User.query.get_or_404(user_id)
    input_data['creator'] = user
    category = input_data.get("category")
    project = PROJ_CATEGORIES[category]()
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
    """Corresponds to Edit Project form"""
    proj = Project.query.get_or_404(id)
    if {u.user_id:u.rank.name for u in proj.members}[token_auth.current_user().id] != 'Admin': # TODO Haven't tried this yet. Needs better way
        return 403
    input_data = request.get_json()
    
    # TODO Check if user has perms
    proj.from_dict(input_data)
    
    db.session.commit()

    return jsonify(proj.to_dict()) 

@bp.route('/project/<int:id>/scrum', methods=['GET'])
def get_scrum(id):
    return jsonify(Project.query.get_or_404(id).scrum_to_dict())

@bp.route('/project/<int:id>/update_scrum', methods=['PUT'])
# @token_auth.login_required
def update_scrum(id):
    """input_data not same format as get_scrum!"""
    #TODO: one more sneaky edge case when moving tasks gives duplicates
    input_data = request.get_json()
    proj = Project.query.get_or_404(id)
    orig_tasks = [(t.text, t.id, t.task_type) for t in proj.scrum_board.all()]
    # print(orig_tasks)
    for text, _id, typ in orig_tasks:
        if (text, typ) not in [(t['text'], t['task_type']) for t in input_data]:
            db.session.delete(ScrumTask.query.get_or_404(_id))
    for t in input_data:
        if (t['text'], t['task_type']) not in [(i[0],i[2]) for i in orig_tasks]: #avoid redundant tasks
            task = ScrumTask(project_id=id, 
                            user_id=1,#input_data.get('user_id'),
                            text=t.get('text'),
                            task_type=t.get('task_type'))
            db.session.add(task)
    db.session.commit()
    return jsonify(Project.query.get_or_404(id).scrum_to_dict())

@bp.route('/project/<int:id>/request', methods=['GET', 'POST'])
# @token_auth.login_required
def request_project(id):
    ''' 
    endpoint for both sending request and sending invitation 
    u_inv a username string
    '''
    input_data = request.get_json()
    proj = Project.query.get_or_404(id) 
    usr = input_data.get('user')
    if type(usr) != int:
        u = User.query.filter_by(username=usr).first_or_404() #this is either the username requesting or the one invited
    else:
        u = User.query.get_or_404(usr)

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
        
    return jsonify(proj.to_dict())

@bp.route('/project/<int:id>/cancel_request', methods=['DELETE'])
# @token_auth.login_required
def cancel_request(id):
    proj = Project.query.get_or_404(id)
    ...

@bp.route('/project/<int:id>/delete', methods=['POST'])
# @token_auth.login_required
def delete_project(id):
    ...