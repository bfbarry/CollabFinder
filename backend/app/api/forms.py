from datetime import datetime
from flask import render_template, flash, redirect, url_for, request, g, \
                    current_app, jsonify, abort
from flask_babel import _
from app.api import bp

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

"""
Forms
These should all be get requests, with associated posts 
and puts in their respective files
"""

# class SearchForm(FlaskForm):
#     q = StringField(_l('Find a project'), validators=[DataRequired()])

#     def __init__(self, *args, **kwargs):
#         if 'formdata' not in kwargs:
#             kwargs['formdata'] = request.args # for the GET request
#         if 'csrf_enabled' not in kwargs:
#             kwargs['csrf_enabled'] = False
#         super(SearchForm, self).__init__(*args, **kwargs)


with open('./app/data/colleges.json','r') as f:
    colleges = json.load(f)
    colleges = [i for i in colleges if 'college' in i.lower() or 'university' in i.lower()]

@bp.route('/forms/create_project', methods=['GET'])
def project_form():
    """Create a new project"""
    option1 = _l('Select one')
    categories = [option1] + _l_list(['learning','software development'])# test version, see below
    #categories = [option1] + sorted(_l_list(proj_cat_keys)) 
    skill_lvls = _l_list(('any','beginner','intermediate','advanced'))
    proj_settings =  _l_list(("casual", "serious/professional"))
    geo_options = _l_list(('college/university','high school', 'city (no school)'))
    learning_categories = [option1] + _l_list(sorted(['math', 'computer science', 'foreign language', 'linguistics', 'data science & machine learning', 'statistics', 'physics']))
    pace_types = [option1] + _l_list(("custom (synchronized)","individual (asynchronized) ", "quarter","semester"))
    langs = [option1] + _l_list(sorted(['Python', 'Java', 'javascript', 'HTML', 'C', 'C++','Ruby','Scala']))
    #### Project form fields ####
    
    payload = {
        'name' : {'label':_l('Give your project a name: '), 'maxlength': lens['name']}, 
        'category' : {'label' : _l('Category: '), 'options': categories}, # SELECT FIELD
        'descr' : {'label':_l('Describe your project: '), 'maxlength': lens['descr']}, #make 1030
        'skill_level' : {'label':_l('Skill Level: '),   'options':skill_lvls}, # RADIO FIELD
        'setting' : {'label':_l('Setting: '),   'options':proj_settings}, # RADIO FIELD
        'chat_link': {'label':_l('Chat link: ')},
        ### GEO ###
        'geo_type' : {'label':_l('Is this project constrained to a city or school?'),   'options':geo_options}, #RADIO FIELD
        'college' :{'label':_l('Enter college or university (must be currently enrolled or recent alum): '), 'options':colleges}, # CUSTOM STRING FIELD 
        ### Learning ###
        'learning_category' : {'label':_l('Learning category: '),   'options':learning_categories}, # SELECT FIELD
        'pace' : {'label': _l('Learning pace: '),   'options':pace_types}, # SELECT FIELD
        'resource' : {'label': _l('Main resource (can be a textbook, website, playlist, etc.): '), 'maxlength': lens['resource']},
        ### Software Development ###
        'lang' : {'label':_l('Language(s): '),   'options':['None'] + langs} #eventually would want to type it and it autofills since there are so many


    }
    return jsonify(payload)

# class EditProjectForm(FlaskForm):
#     lens = lens
#     name = TextAreaField(_l('Project name:'), validators=[
#         DataRequired(), Length(min=1, max=60)],render_kw={'maxlength': lens['name']})
#     descr = TextAreaField(_l('Description: '),validators=[
#         DataRequired(), Length(min=0, max=140)])
#     chat_link = TextAreaField(_l('Link to messaging platform: '),validators=[Length(min=0, max=512)]) # Discord, slack etc.
#     tags = TextAreaField(_l('Tags: '),validators=[Length(min=0, max=300)])
#     wanted_positions = TextAreaField(_l('Wanted positions: '),validators=[Length(min=0, max=300)])
#     submit = SubmitField(_l('Save'))

#     def __init__(self, original_name, *args, **kwargs):
#         super(EditProjectForm, self).__init__(*args, **kwargs)
#         self.original_name = original_name

#     def validate_name(self, name):
#         if name.data != self.original_name:
#             project = Project.query.filter_by(name=self.name.data).first()
#             if project is not None:
#                 raise ValidationError(_('This particular project name is already taken.'))


