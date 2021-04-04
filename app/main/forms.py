from flask import request
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, SelectField
from wtforms.validators import ValidationError, DataRequired, Length
from flask_babel import _, lazy_gettext as _l
from app.models import User, Project

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
    submit = SubmitField(_l('Submit'))

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


class ProjectForm(FlaskForm):
    """Create a new project, on /index"""
    lens = col_char_lim(Project)
    # SelectField options
    option1 = _l('Select one')
    categories = [option1] + _l_list(['learning','software development']) # test version, see below
    #categories = [option1] + sorted(proj_categories.keys) 
    proj_settings = [option1] + _l_list(("casual", "serious/professional"))
    skill_lvls = [option1] + _l_list(('any','beginner','intermediate','advanced'))
    ## proj spec
    learning_categories = [option1] + _l_list(sorted(['math', 'computer science', 'foreign language', 'linguistics', 'data science & machine learning', 'statistics', 'physics']))
    pace_types = [option1] + _l_list(("custom-pace","self-paced", "quarter","semester"))
    langs = [option1] + _l_list(sorted(['Python', 'Java', 'javascript', 'HTML', 'C', 'C++','Ruby','Scala']))

    #Basic form fields
    name = TextAreaField(_l('Give your project a name'), validators=[
        DataRequired(), Length(min=1, max=60)],render_kw={'maxlength': lens['name']})
    category = SelectField(_l('Category'), choices=categories, default=1)
    descr = TextAreaField(_l('Describe your project'), validators=[ 
        DataRequired(), Length(min=1, max=140)],render_kw={'maxlength': lens['descr']}) #make 1030
    skill_level = SelectField(_l('Skill Level'), choices=skill_lvls, default=1)
    setting = SelectField(_l('Setting'), choices=proj_settings, default=1)    
    
    #Learning
    learning_category = SelectField(_l('Learning category'), choices=learning_categories, default=1)
    pace = SelectField(_l('Learning pace'), choices=pace_types, default=1)

    #Software Development
    lang = SelectField(_l('Language'), choices=['None'] + langs, default=1) #eventually would want to type it and it autofills since there are so many
    
    submit = SubmitField(_l('Create Project'))

