from app import app
from flask import render_template, flash, redirect, url_for
from app.models import User, Project #, \
                            #Learning #Project subclasses
#login stuff
from app.forms import LoginForm, RegistrationForm, ProjectForm, EditProfileForm, EmptyForm
from flask_login import current_user, login_user, logout_user, login_required
from flask import request
from werkzeug.urls import url_parse
#user things
from app import db

import sys
import logging

### View functions ###
@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST']) #how to require login only for creating a project on /index?
@login_required
def index():
    form = ProjectForm()
    if form.validate_on_submit():
        project = Project(creator=current_user, name = form.name.data, category = form.category.data, #consider using **kwargs
                        descr=form.descr.data)
        db.session.add(project)
        
        spec_arg_names = [attr for attr in list(vars(ProjectForm)) if not attr.startswith("_")][6:-1] #args except ones above and submit
        spec_args = []
        for a in spec_arg_names:
            print(a, flush=True)
            exec(f'spec_args.append(form.{a}.data)')
        spec_args = [a for a in spec_args if a != 'None'] # only the args that were inputted on the form
        
        # project_spec = ProjectDB.categories[form.category.data](*spec_args) #instatiating the specific project
        # db.session.add(project_spec)
        
        #db.session.commit()
        print(spec_args, flush=True)
        flash('Your project is now live!')
        return redirect(url_for('index')) #want this redirect because of POST; avoids having to refresh
    
    projects = current_user.followed_projects().all()
    
    return render_template('index.html', title='Home', form = form, projects = projects)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index')) #redirects if user tries to login again
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first() #access database
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        #handling for login_required
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/user/<username>') #dynamic component
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    projects = [
        {'creator': user, 'desc': 'Test post #1'},
        {'creator': user, 'desc': 'Test post #2'}
    ]
    form = EmptyForm() #follow/unfollow button
    return render_template('user.html', user=user, projects=projects, form=form)

@app.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(current_user.username)
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.about_me = form.about_me.data
        db.session.commit()
        flash('Your changes have been saved.')
        return redirect(url_for('edit_profile'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.about_me.data = current_user.about_me
    return render_template('edit_profile.html', title='Edit Profile',
                           form=form)

@app.route('/follow/<username>', methods=['POST'])
@login_required
def follow(username):
    form = EmptyForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash('User {} not found.'.format(username))
            return redirect(url_for('index'))
        if user == current_user:
            flash('You cannot follow yourself!')
            return redirect(url_for('user', username=username))
        current_user.follow(user)
        db.session.commit()
        flash('You are following {}!'.format(username))
        return redirect(url_for('user', username=username))
    else:
        return redirect(url_for('index'))

@app.route('/unfollow/<username>', methods=['POST'])
@login_required
def unfollow(username):
    form = EmptyForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash('User {} not found.'.format(username))
            return redirect(url_for('index'))
        if user == current_user:
            flash('You cannot unfollow yourself!')
            return redirect(url_for('user', username=username))
        current_user.unfollow(user)
        db.session.commit()
        flash('You are not following {}.'.format(username))
        return redirect(url_for('user', username=username))
    else:
        return redirect(url_for('index'))

# @app.route('/project/<project_id>')
# def project(projectname):
#     ...