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


@bp.route('/project/create', methods=['POST'])
@login_required
def create_project():
    input_data = request.get_json()
    category = input_data.get("category")
    name = input_data.get("name")
    skill_level = input_data.get("skill_level")
    setting = input_data.get("setting")
    descr = input_data.get("descr")

    project = Project(creator=None,
        chat_link = None,  
        name = name, 
        category = category,
        skill_level = skill_level, 
        setting = setting, 
        descr=descr, 
        language="phold", 
    ) #instatiating the specific project
         
    db.session.add(project)
    db.session.commit() #so that project.id can be extracted later
    # membership = ProjMember(user_id="placeholder", project_id = project.id, rank_id=3,position_id=None)
    # current_user.member_of.append(membership)
    # db.session.commit()
    return {"id": project.id}

@bp.route('/project/<int:id>', methods=['POST'])
def get_project(id):
    proj = Project.query.get_or_404(id)
    proj_data = {**proj.to_dict_main(), 
            **proj.to_dict()}
    return jsonify(proj_data)
   
@bp.route('/project/<int:id>/update', methods=['POST'])
@login_required
def update_project(id):
    proj = Project.query.get_or_404(id)
    proj_data = {**proj.to_dict_main(), 
            **proj.to_dict()}
    
    input_data = request.get_json()
    
    tag_names, pos_names  = [t.name for t in Tag.query.all()], [p.name for p in Position.query.all()]
    tagms, posms = [], [] # holds the associated models (needed for db commits!)
    # TODO Check if user has perms

    proj.from_dict(input_data)
    
    #current form data for tags and wanted positions
    tags, wpos = [i.strip() for i in form.tags.data.split(',')], [i.strip() for i in form.wanted_positions.data.split(',')]
    orig_tags, orig_wpos = [t.name for t in proj.tags], [p.name for p in proj.wanted_positions]
    for t in orig_tags:
        if t not in tags:
            proj.rm_tag(Tag.query.filter_by(name=t).first())
    for p in orig_wpos:
        if p not in wpos:
            proj.rm_tag(Position.query.filter_by(name=p).first(),kind='w_pos')
    
    for tag in tags:
        tag = tag.lower()
        if tag not in tag_names:
            db.session.add(Tag(name=tag))
            db.session.commit()
        tagms.append(Tag.query.filter_by(name=tag).first()) #there should only be one
    for pos in wpos:
        pos = pos.lower()
        if pos not in pos_names:
            db.session.add(Position(name=pos))
            db.session.commit()
        posms.append(Position.query.filter_by(name=pos).first())
    
    proj.add_tags(tagms)
    proj.add_tags(posms,kind='w_pos')
    
    db.session.commit()
    

@bp.route('/project/<project_id>/delete', methods=['POST'])
def delete_project(project_id):
    ...