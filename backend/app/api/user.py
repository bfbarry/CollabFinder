from app.api.errors import bad_request
from datetime import datetime
from flask import render_template, flash, redirect, url_for, request, g, \
                    current_app, jsonify, abort
from flask_login import current_user, login_required
from flask_babel import _, get_locale
from guess_language import guess_language
from app import db
from app.main.forms import SearchForm, EditProfileForm, EmptyForm, ProjectForm, TestForm, EditProjectForm, RequestForm
from app.models import User, Project, ProjMember, JoinRequest, Tag, Position, proj_categories, \
                            Learning #Project subclasses
from app.api import bp
# from app.api.auth import token_auth

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
    # user.last_notif_read_time = datetime.utcnow() # How to handle this read time?
    # db.session.commit()
    page = request.args.get('page',1, type=int)
    invites = user.proj_requests.filter_by(kind='invite')
    requests = JoinRequest.query.filter_by(kind='request').join(ProjMember,
            (JoinRequest.project_id == ProjMember.project_id)).filter(
                ProjMember.user_id == user.id)
    messages = invites.union(requests).order_by(JoinRequest.timestamp.desc()) #order now because union queries can't be ordered
    p_ids = [m.project_id for m in messages]
    p_objs = [Project.query.get(i) for i in p_ids]
    proj_id_map = {k:v for k,v in zip(p_ids, p_objs)} #for easy displaying on HTML
    messages = messages.paginate(page, 5, False)

    next_url = url_for('api.get_messages', page = messages.next_num) \
        if messages.has_next else None
    prev_url = url_for('api.get_messages', page = messages.prev_num) \
        if messages.has_prev else None
    
    data = {
        'proj_id_map':proj_id_map, # this no work
        'messages': [{'user_id': m.user_id,
                    'project_id':m.project_id,
                    'msg':m.msg,
                    'kind':m.kind} for m in messages.items],
        '_links': {'self': None,
                'next': next_url,
                'prev': prev_url}
    }
    return jsonify(data)

@bp.route('/test/put', methods=['PUT'])
# @token_auth.login_required
def test_put():
    data = request.get_json().get("hello")
    return {"got_hello": data}



    