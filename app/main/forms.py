from flask import request
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, SelectField, RadioField
from wtforms.validators import ValidationError, DataRequired, Length
from flask_babel import _, lazy_gettext as _l
from app.models import User, Project, JoinRequest, proj_cat_keys,\
                            Learning #Project subclasses
import json

### Helper functions ###
def _l_list(l):
    return [_l(i) for i in l]

import re
def col_char_lim(model):
    """returns dict of form {colname:length} for string columns"""
    tb_info = str(vars(model)['__table__'].__dict__['constraints']).split('Column(')
    tb_lens = dict()
    for v in tb_info:
        if 'length=' in v:
            colname, c_len = re.findall(r"\'(.+?)\'", v)[0], re.findall(r"length=(.+?)\)", v)[0]
            tb_lens[colname] = int(c_len)
    return tb_lens

lens = {**col_char_lim(Project), **col_char_lim(Learning),**col_char_lim(JoinRequest)} #DB character lengths for input field limit

### Forms ###
class SearchForm(FlaskForm):
    q = StringField(_l('Find a project'), validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        if 'formdata' not in kwargs:
            kwargs['formdata'] = request.args # for the GET request
        if 'csrf_enabled' not in kwargs:
            kwargs['csrf_enabled'] = False
        super(SearchForm, self).__init__(*args, **kwargs)

class EditProfileForm(FlaskForm):
    username = StringField(_l('Username'), validators=[DataRequired()])
    about_me = TextAreaField(_l('About me'),
                             validators=[Length(min=0, max=140)])
    submit = SubmitField(_l('Save'))

    def __init__(self, original_username, *args, **kwargs):
        super(EditProfileForm, self).__init__(*args, **kwargs)
        self.original_username = original_username

    def validate_username(self, username):
        if username.data != self.original_username:
            user = User.query.filter_by(username=self.username.data).first()
            if user is not None:
                raise ValidationError(_('Please use a different username.'))


class EmptyForm(FlaskForm):
    submit = SubmitField('Submit')

class RequestForm(FlaskForm):
    ''' empty labels depend on "request" or "invitation" in JS'''
    lens=lens #why is this necessary?
    u_inv = TextAreaField('Name of user to invite: ')
    msg = TextAreaField(' ', validators=[
        DataRequired(), Length(min=1, max=lens['msg'])],render_kw={'maxlength': lens['msg']})
    submit = SubmitField(' ')

with open('./app/data/colleges.json','r') as f:
    colleges = json.load(f)
    colleges = [i for i in colleges if 'college' in i.lower() or 'university' in i.lower()]
class ProjectForm(FlaskForm):
    """Create a new project, on /index"""
    lens = lens
    option1 = _l('Select one')

    #### Project form fields ####
    name = TextAreaField(_l('Give your project a name'), validators=[
        DataRequired(), Length(min=1, max=60)],render_kw={'maxlength': lens['name']})
    
    categories = [option1] + _l_list(['learning','software development']) # test version, see below
    #categories = [option1] + sorted(_l_list(proj_cat_keys)) 
    category = SelectField(_l('Category'), choices=categories, default=1)
    
    descr = TextAreaField(_l('Describe your project'), validators=[ 
        DataRequired(), Length(min=1, max=140)],render_kw={'maxlength': lens['descr']}) #make 1030
    
    skill_lvls = _l_list(('any','beginner','intermediate','advanced'))
    skill_level = RadioField(_l('Skill Level'), choices=skill_lvls)
    
    proj_settings =  _l_list(("casual", "serious/professional"))
    setting = RadioField(_l('Setting'), choices=proj_settings)

    ### Geo ###
    geo_options = _l_list(('College/university','High school', 'City (no school)'))
    geo_type = RadioField(_l('Is this project constrained to a city or school?'), choices=geo_options)
    
    colleges= [option1] + colleges[:20]
    college=SelectField(_l('Select college or university'), choices=colleges, default=1)
    ### Learning ###
    learning_categories = [option1] + _l_list(sorted(['math', 'computer science', 'foreign language', 'linguistics', 'data science & machine learning', 'statistics', 'physics']))
    learning_category = SelectField(_l('Learning category'), choices=learning_categories, default=1)
    
    pace_types = [option1] + _l_list(("custom (synchronized)","individual (asynchronized) ", "quarter","semester"))
    pace = SelectField(_l('Learning pace'), choices=pace_types, default=1)

    resource = TextAreaField(_l('Main resource (can be a textbook, website, playlist, etc.)'), validators=[
        Length(min=1, max=60)],render_kw={'maxlength': lens['resource']})

    ### Software Development ###
    langs = [option1] + _l_list(sorted(['Python', 'Java', 'javascript', 'HTML', 'C', 'C++','Ruby','Scala']))
    lang = SelectField(_l('Language'), choices=['None'] + langs, default=1) #eventually would want to type it and it autofills since there are so many
    
    submit = SubmitField(_l('Create Project'))

    def validate_name(self, name):
        project = Project.query.filter_by(name=name.data).first()
        if project is not None:
            raise ValidationError(_('This particular project name is already taken.'))

class EditProjectForm(FlaskForm):
    lens = lens
    name = TextAreaField(_l('Project name:'), validators=[
        DataRequired(), Length(min=1, max=60)],render_kw={'maxlength': lens['name']})
    descr = TextAreaField(_l('Description: '),validators=[
        DataRequired(), Length(min=0, max=140)])
    chat_link = TextAreaField(_l('Link to messaging platform: '),validators=[Length(min=0, max=512)]) # Discord, slack etc.
    tags = TextAreaField(_l('Tags: '),validators=[Length(min=0, max=300)])
    wanted_positions = TextAreaField(_l('Wanted positions: '),validators=[Length(min=0, max=300)])
    submit = SubmitField(_l('Save'))

    def __init__(self, original_name, *args, **kwargs):
        super(EditProjectForm, self).__init__(*args, **kwargs)
        self.original_name = original_name

    def validate_name(self, name):
        if name.data != self.original_name:
            project = Project.query.filter_by(name=self.name.data).first()
            if project is not None:
                raise ValidationError(_('This particular project name is already taken.'))

class TestForm(FlaskForm):
    rad = RadioField('Select an option:', choices=['a','b','c'])

