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
import json

# @bp.before_app_request
# def before_request():
#     if current_user.is_authenticated:
#         current_user.last_seen = datetime.utcnow()
#         db.session.commit()
#         g.search_form = SearchForm() # g variable is specific to each request and each client
#     g.locale = str(get_locale())

@bp.route('/project/<int:id>', methods=['POST'])
def get_project(id):
    proj = Project.query.get_or_404(id)
    proj_data = proj.to_dict()
    return jsonify(proj_data)

@bp.route('/projects', methods=['GET'])
def get_projects():
    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = Project.to_collection_dict(Project.query, page, per_page, 'api.get_projects')
    return jsonify(data)

@bp.route('/project/create', methods=['POST'])
# @login_required
def create_project():
    input_data = request.get_json()
    category = input_data.get("category")

    project = proj_categories[category]()
    project.from_dict(input_data)
         
    db.session.add(project)
    db.session.commit() #so that project.id can be extracted later
    # membership = ProjMember(user_id="placeholder", project_id = project.id, rank_id=3,position_id=None)
    # current_user.member_of.append(membership)
    # db.session.commit()
    return jsonify(project.to_dict())

@bp.route('/project/<int:id>/update', methods=['POST'])
@login_required
def update_project(id):

    proj = Project.query.get_or_404(id)
    input_data = request.get_json()
    
    tag_names, pos_names  = [t.name for t in Tag.query.all()], [p.name for p in Position.query.all()]
    # TODO Check if user has perms
    # TODO add from_dict() for specific sub classes
    proj.from_dict_main(input_data)
    
    for tag in input_data['tags']:
        tag = tag.lower()
        if tag not in tag_names:
            db.session.add(Tag(name=tag))
            db.session.commit()
        
    for pos in input_data['wanted_positions']:
        pos = pos.lower()
        if pos not in pos_names:
            db.session.add(Position(name=pos))
            db.session.commit()

    db.session.commit()

    return jsonify(proj.to_dict_main()) 

@bp.route('/project/<int:id>/delete', methods=['POST'])
def delete_project(id):
    ...

# curl -X POST -H "Content-Type: application/json" http://127.0.0.1:5000/api/project/create --data '{"creator":null, "name":"a44","category":"learning","skill_level":"skilz","setting":"set","descr":"asd","language":"phold","pace":"g","learning_category":"l1","subject":"0","resource":"mc"}'