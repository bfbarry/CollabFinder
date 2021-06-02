from app.api.errors import bad_request
from datetime import datetime
from flask import render_template, flash, redirect, url_for, request, g, \
                    current_app, jsonify
from flask_login import current_user, login_required
from flask_babel import _, get_locale
from guess_language import guess_language
from app import db
from app.main.forms import SearchForm, EditProfileForm, EmptyForm, ProjectForm, TestForm, EditProjectForm, RequestForm
from app.models import User, Project, ProjMember, JoinRequest, Tag, Position, proj_categories, \
                            Learning #Project subclasses
from app.api import bp

# @bp.before_app_request
# def before_request():
#     if current_user.is_authenticated:
#         current_user.last_seen = datetime.utcnow()
#         db.session.commit()
#         g.search_form = SearchForm() # g variable is specific to each request and each client
#     g.locale = str(get_locale())

@bp.route('/user/<username>')
@login_required
def user(username):
    '''profile page'''
    user = User.query.filter_by(username=username).first_or_404()
    page = request.args.get('page', 1, type=int)
    projects = user.projects.order_by(Project.timestamp.desc()).paginate(
        page, current_app.config['PROJECTS_PER_PAGE'], False)
    next_url = url_for('main.user', username=user.username,
                       page=projects.next_num) if projects.has_next else None
    prev_url = url_for('main.user', username=user.username,
                       page=projects.prev_num) if projects.has_prev else None
    form = EmptyForm()
    return render_template('user.html', user=user, projects=projects.items,
                           next_url=next_url, prev_url=prev_url, form=form)


@bp.route('/user/<username>', methods=['PUT'])
@login_required
def put_user():
    form = EditProfileForm(current_user.username)
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.about_me = form.about_me.data
        db.session.commit()
        flash(_('Your changes have been saved.'))
        return redirect(url_for('main.edit_profile'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.about_me.data = current_user.about_me
    return render_template('edit_profile.html', title=_('Edit Profile'),
                           form=form)
    
@bp.route('/test/put', methods=['PUT'])
def test_put():
    data = request.get_json().get("sex")
    return {"got_sex": data}


### TODO: following tutorial ###
# change all methods to POST later?

@bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    return jsonify(User.query.get_or_404(id).to_dict())

@bp.route('/users', methods=['GET'])
def get_users():
    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(User.query, page, per_page, 'api.get_users')
    return jsonify(data)

@bp.route('/users/<int:id>/followers', methods=['GET'])
def get_followers(id):
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(user.followers, page, per_page,
                                     'api.get_followers', id=id)
    return jsonify(data)

@bp.route('/users/<int:id>/followed', methods=['GET'])
def get_followed(id):
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(user.followed, page, per_page,
                                     'api.get_followed', id=id)
    return jsonify(data)

@bp.route('/users', methods=['POST'])
def create_user(id):
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
def update_user(id):
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

    