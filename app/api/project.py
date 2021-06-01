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

@bp.route('/project/<project_id>', methods=['POST'])
def get_project(project_id):
    proj = Project.query.get(project_id) #.first_or_404()
    # model = proj_categories[proj.category]
    # proj_sub = model.query.get(project_id) #.first_or_404() #to access all subclass properties
    # #print(f'\n {model} \n', flush=1)
    # proj_dict = {}
    # spec_args = [attr for attr in list(vars(model)) if not attr.startswith("_")][2:]
    # for a in spec_args:
    #     exec(f'proj_dict[a] = proj_sub.{a}')

    # form = EmptyForm()
    return jsonify(proj)
   
@bp.route('/project/<project_id>/update', methods=['POST'])
@login_required
def update_project(project_id):
    proj = Project.query.get(project_id)
    form = EditProjectForm(proj.name)
    
    tag_names, pos_names  = [t.name for t in Tag.query.all()], [p.name for p in Position.query.all()]
    tagms, posms = [], [] # holds the associated models (needed for db commits!)
    if current_user != proj.creator: # removed .username (Remove me)
        flash(_('Must be project admin to make changes'))
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        proj.name = form.name.data
        proj.descr = form.descr.data
        proj.chat_link = form.chat_link.data
        
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
        flash(_('Your changes have been saved.'))
        return redirect(url_for('main.project', project_id=proj.id))
    elif request.method == 'GET':
        form.name.data = proj.name
        form.descr.data = proj.descr
        form.chat_link.data = proj.chat_link
        form.tags.data = ', '.join(map(str, [t.name for t in proj.tags]))
        form.wanted_positions.data = ', '.join(map(str, [p.name for p in proj.wanted_positions]))
    return render_template('edit_project.html', title=_('Edit Project'), form=form)

@bp.route('/project/<project_id>/delete', methods=['POST'])
def delete_project(project_id):
    ...