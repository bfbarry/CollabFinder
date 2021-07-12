from app.api.errors import bad_request
from flask import url_for, request, g, jsonify, abort
from flask_babel import _
from app import db
from app.models import User, Project, ProjMember, JoinRequest, Tag, Position, proj_categories
from app.api import bp
from app.api.auth import token_auth

from datetime import datetime

# @bp.before_app_request
# def before_request():
#     if current_user.is_authenticated:
#         current_user.last_seen = datetime.utcnow()
#         db.session.commit()
#         g.search_form = SearchForm() # g variable is specific to each request and each client
#     g.locale = str(get_locale())

### TODO: following tutorial ###
# change all methods to POST later?

@bp.route('/users/<int:id>', methods=['GET'])
# @token_auth.login_required
def get_user(id):
    return jsonify(User.query.get_or_404(id).to_dict())

@bp.route('/users', methods=['GET'])
def get_users():
    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(User.query, page, per_page, 'api.get_users')
    return jsonify(data)

@bp.route('/users/<int:id>/followers', methods=['GET'])
# @token_auth.login_required
def get_followers(id):
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(user.followers, page, per_page,
                                     'api.get_followers', id=id)
    return jsonify(data)

@bp.route('/users/<int:id>/followed', methods=['GET'])
# @token_auth.login_required
def get_followed(id):
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(user.followed, page, per_page,
                                     'api.get_followed', id=id)
    return jsonify(data)

@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return bad_request('must include username, email and password fields')
    if User.query.filter_by(username=data['username']).first():
        return bad_request('username taken.')
    if User.query.filter_by(email=data['email']).first():
        return bad_request('email address already used.')
    user = User()
    user.from_dict(data, new_user=True)
    db.session.add(user)
    db.session.commit()
    response = jsonify(user.to_dict())
    response.status_code = 201
    response.headers['Location'] = url_for('api.get_user', id=user.id)
    return response

@bp.route('/users/<int:id>', methods=['PUT'])
# @token_auth.login_required
def update_user(id):
    # if token_auth.current_user().id != id:
    #     abort(403)
    user = User.query.get_or_404(id)
    data = request.get_json() or {}
    if 'username' in data and data['username'] != user.username and \
        User.query.filter_by(username=data['username']).first():
        return bad_request('username taken.')
    if 'email' in data and data['email'] != user.username and \
        User.query.filter_by(username=data['email']).first():
        return bad_request('email taken.')

    user.from_dict(data, new_user=False)
    db.session.commit()
    return jsonify(user.to_dict())
    
@bp.route('/users/<int:id>/messages')
# @token_auth.login_required
def get_messages(id):
    '''proj_id_map used in view to check if is_member (! not jsonifying well)'''
    user = User.query.get_or_404(id)
    user.last_notif_read_time = datetime.utcnow() 
    db.session.commit()
    page = request.args.get('page',1, type=int)
    invites = user.proj_requests.filter_by(kind='invite')
    requests = JoinRequest.query.filter_by(kind='request').join(ProjMember,
            (JoinRequest.project_id == ProjMember.project_id)).filter(
                ProjMember.user_id == user.id)
    messages = invites.union(requests).order_by(JoinRequest.timestamp.desc()) #order now because union queries can't be ordered

    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)

    data = JoinRequest.to_collection_dict(messages, page, per_page, 'api.get_messages', id=id)
    # data['unread_count'] = user.new_requests()
   
    return jsonify(data)

@bp.route('/users/<int:id>/notif_count')
# @token_auth.login_required
def get_notif_count(id):
    user = User.query.get_or_404(id)
    return {'notif_count':user.new_requests()}
   

@bp.route('/users/<int:id>/handle_proj_request', methods=['PUT'])
# @token_auth.login_required
def handle_proj_request(id):
    ''' 
    endpoint for both sending request and sending invitation 
    u_inv a username string
    '''
    input_data = request.get_json()
    print('\n', input_data, '\n')
    proj = Project.query.get(input_data.get('project_id'))
    user_id = input_data.get('user_id')
    m = ProjMember(user_id=user_id, rank_id=1, project_id = proj.id,position_id=None)
    proj.add_member(user_id,m)
    db.session.commit()
    
    return get_messages(id)

@bp.route('/test/put', methods=['PUT'])
# @token_auth.login_required
def test_put():
    data = request.get_json().get("hello")
    return {"got_hello": data}



    