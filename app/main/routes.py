from datetime import datetime
from flask import render_template, flash, redirect, url_for, request, g, \
    current_app
from flask_login import current_user, login_required
from flask_babel import _, get_locale
from guess_language import guess_language
from app import db
from app.main.forms import SearchForm, EditProfileForm, EmptyForm, ProjectForm, TestForm, EditProjectForm, RequestForm
from app.models import User, Project, JoinRequest, Tag, Position, proj_categories, \
                            Learning #Project subclasses
from app.main import bp


@bp.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()
    g.search_form = SearchForm() # g variable is specific to each request and each client
    g.locale = str(get_locale())

@bp.route('/search')
#@login_required # don't want login req
def search():
    if not g.search_form.validate(): # not validate_on_submit since GET
        return redirect(url_for('main.explore')) # empty search case
    page = request.args.get('page', 1, type=int)
    projects, total = Project.search(g.search_form.q.data, page,
                               current_app.config['PROJECTS_PER_PAGE'])
    next_url = url_for('main.search', q=g.search_form.q.data, page=page + 1) \
        if total > page * current_app.config['PROJECTS_PER_PAGE'] else None
    prev_url = url_for('main.search', q=g.search_form.q.data, page=page - 1) \
        if page > 1 else None
    return render_template('search.html', title=_('Search for a project'), projects=projects,
                           next_url=next_url, prev_url=prev_url)

@bp.route('/', methods=['GET', 'POST'])
@bp.route('/index', methods=['GET', 'POST'])
@login_required # don't want this
def index():
    page = request.args.get('page', 1, type=int)
    projects = current_user.followed_projects().paginate(
        page, current_app.config['PROJECTS_PER_PAGE'], False)
    next_url = url_for('main.index', page=projects.next_num) \
        if projects.has_next else None
    prev_url = url_for('main.index', page=projects.prev_num) \
        if projects.has_prev else None
    return render_template('index.html', title=_('Home'), projects = projects.items, 
                            next_url=next_url, prev_url=prev_url)

@bp.route('/create_project', methods=['GET', 'POST'])
@login_required
def create_project():
    form = ProjectForm()
    if form.validate_on_submit():
        language = guess_language(form.descr.data)
        if language == 'UNKNOWN' or len(language) > 5:
            language = ''

        proj_kwargs = {}
        proj_model = proj_categories[form.category.data]
        spec_args = [attr for attr in list(vars(proj_model)) if not attr.startswith("_")][2:] # skipping id column and field_name
        spec_args = spec_args[:spec_args.index('category')] # to remove Project() var names (why does that happen anyways?)
        form_args = [attr for attr in list(vars(ProjectForm)) if not attr.startswith("_")] #all args of ProjectForm 
        for a in spec_args:
            if a in form_args: #in case some columns of model are not yet implemented in front end
                exec(f'proj_kwargs[a] = form.{a}.data')
        
        project = proj_model(creator=current_user, name = form.name.data, category = form.category.data, #consider using **kwargs
                        skill_level = form.skill_level.data, setting = form.setting.data, descr=form.descr.data, language=language, chat_link = None, **proj_kwargs) #instatiating the specific project
        
        db.session.add(project)
        db.session.commit()
        flash(_('Your project is now live!'))
        return redirect(url_for('main.project', project_id=project.id)) #want this redirect because of POST; avoids having to refresh
        
    return render_template('create_project.html', title=_('Create a Project'), form = form)

@bp.route('/explore')
@login_required
def explore():
    page = request.args.get('page', 1, type=int)
    projects = Project.query.order_by(Project.timestamp.desc()).paginate(
        page, current_app.config['PROJECTS_PER_PAGE'], False)
    next_url = url_for('main.explore', page=projects.next_num) \
        if projects.has_next else None
    prev_url = url_for('main.explore', page=projects.prev_num) \
        if projects.has_prev else None
    return render_template('index.html', title=_('Explore'),
                           projects=projects.items, next_url=next_url,
                           prev_url=prev_url)


@bp.route('/project_<project_id>')
def project(project_id):
    proj = Project.query.get(project_id) #.first_or_404()
    model = proj_categories[proj.category]
    proj_sub = model.query.get(project_id) #.first_or_404() #to access all subclass properties
    #print(f'\n {model} \n', flush=1)
    proj_dict = {}
    spec_args = [attr for attr in list(vars(model)) if not attr.startswith("_")][2:]
    for a in spec_args:
        exec(f'proj_dict[a] = proj_sub.{a}')

    form = EmptyForm()
    return render_template('project.html', proj= proj, proj_dict = proj_dict, tags = [t.name for t in proj.tags], 
                                        wanted_positions = [p.name for p in proj.wanted_positions], form=form)

@bp.route('/edit_project/<project_id>', methods=['GET', 'POST'])
@login_required
def edit_project(project_id):
    proj = Project.query.get(project_id)
    form = EditProjectForm(proj.name)
    
    tag_names, pos_names  = [t.name for t in Tag.query.all()], [p.name for p in Position.query.all()]
    tagms, posms = [], [] # holds the associated models (needed for db commits!)
    if current_user.username != proj.creator.username:
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

@bp.route('/request_project/<project_id>/<kind>', methods=['GET', 'POST'])
@login_required
def request_project(project_id,kind):
    ''' 
    route for both sending request and sending invitation 
    u_inv a username string
    '''
    form = RequestForm()
    proj = Project.query.get(project_id) # also used in HTML
    if form.validate_on_submit():
        if kind == 'invite':
            u = User.query.filter_by(username=form.u_inv.data).first_or_404()
            r = JoinRequest(kind='invite',msg=form.msg.data,status='pending')
            r.project = proj
            r.user = u
            u.send_request(proj,r,kind='invite',u_inv=u) #or could switch it where this method is in User class
            db.session.commit()
            flash(_('Invitation to join sent to %(username)s!', username=form.u_inv.data))
        elif kind == 'request':
            r = JoinRequest(kind='request',msg=form.msg.data,status='pending')
            r.project = proj
            r.user = current_user
            current_user.proj_requests.append(r)
            db.session.commit()
            flash(_('Application sent to %(project)s!', project=proj.name))
        
        return redirect(url_for('main.project', project_id=project_id))
    return render_template('request_project.html', title=_('Project request'), form=form, proj = proj)

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


@bp.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
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


@bp.route('/follow/<username>', methods=['POST'])
@login_required
def follow(username):
    form = EmptyForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash(_('User %(username)s not found.', username=username))
            return redirect(url_for('main.index'))
        if user == current_user:
            flash(_('You cannot follow yourself!'))
            return redirect(url_for('main.user', username=username))
        current_user.follow(user)
        db.session.commit()
        flash(_('You are following %(username)s!', username=username))
        return redirect(url_for('main.user', username=username))
    else:
        return redirect(url_for('main.index'))


@bp.route('/unfollow/<username>', methods=['POST'])
@login_required
def unfollow(username):
    form = EmptyForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash(_('User %(username)s not found.', username=username))
            return redirect(url_for('main.index'))
        if user == current_user:
            flash(_('You cannot unfollow yourself!'))
            return redirect(url_for('main.user', username=username))
        current_user.unfollow(user)
        db.session.commit()
        flash(_('You are not following %(username)s.', username=username))
        return redirect(url_for('main.user', username=username))
    else:
        return redirect(url_for('main.index'))

@bp.route('/test', methods=['GET', 'POST'])
def test_page():
    form = TestForm()
    if form.validate_on_submit():
        pass
    
    return render_template('test.html', title=_(' :-) '), form = form)