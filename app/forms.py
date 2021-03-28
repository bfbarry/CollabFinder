from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField, BooleanField, SubmitField, SelectField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length
from flask_babel import _, lazy_gettext as _l
from app.models import User, Project
#from routes import proj_categories

def _l_list(l):
    return ([_l(i) for i in l])

class LoginForm(FlaskForm):
    username = StringField(_l('Username'), validators=[DataRequired()])
    password = PasswordField(_l('Password'), validators=[DataRequired()])
    remember_me = BooleanField(_l('Remember Me'))
    submit = SubmitField(_l('Sign In'))

class RegistrationForm(FlaskForm):
    username = StringField(_l('Username'), validators=[DataRequired()])
    email = StringField(_l('Email'), validators=[DataRequired(), Email()])
    password = PasswordField(_l('Password'), validators=[DataRequired()])
    password2 = PasswordField(
        _l('Repeat Password'), validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField(_l('Register'))

    def validate_username(self, username):
        """validate_<field_name> are WTForms custom validators """
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError(_('Please use a different username.'))

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError(_('Please use a different email address.'))

class ProjectForm(FlaskForm):
    """Create a new project, on /index"""
    # SelectField options
    option1 = _l('Select one')
    categories = [option1] + _l_list(['learning','software development']) # test version, see below
    #categories = [option1] + sorted(proj_categories.keys) 
    proj_settings = (option1,) + _l_list(("casual", "serious/professional"))
    skill_lvls = (option1,) + _l_list(('any','beginner','intermediate','advanced'))
    ## proj spec
    learning_categories = [option1] + _l_list(sorted(['math', 'computer science', 'foreign language', 'linguistics', 'data science & machine learning', 'statistics', 'physics']))
    pace_types = (option1,) + _l_list(("custom-pace","self-paced", "quarter","semester"))
    langs = [option1] + _l_list(sorted(['Python', 'Java', 'javascript', 'HTML', 'C', 'C++','Ruby','Scala']))

    #Basic form fields
    name = TextAreaField(_l('Give your project a name'), validators=[
        DataRequired(), Length(min=1, max=60)])
    category = SelectField(_l('Category'), choices=categories, default=1)
    descr = TextAreaField(_l('Describe your project'), validators=[ 
        DataRequired(), Length(min=1, max=140)]) #make 1030
    skill_level = SelectField(_l('Skill Level'), choices=skill_lvls, default=1)
    setting = SelectField(_l('Setting'), choices=proj_settings, default=1)    
    
    #Learning
    learning_category = SelectField(_l('Learning category'), choices=learning_categories, default=1)
    pace = SelectField(_l('Learning pace'), choices=pace_types, default=1)

    #Software Development
    lang = SelectField(_l('Language'), choices=['None'] + langs, default=1) #eventually would want to type it and it autofills since there are so many
    
    submit = SubmitField(_l('Create Project'))

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

class ResetPasswordRequestForm(FlaskForm):
    email = StringField(_l('Email'), validators=[DataRequired(), Email()])
    submit = SubmitField(_l('Request Password Reset'))

class ResetPasswordForm(FlaskForm):
    password = PasswordField(_l('Password'), validators=[DataRequired()])
    password2 = PasswordField(
        _l('Repeat Password'), validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField(_l('Request Password Reset'))
    
class EmptyForm(FlaskForm):
    """Empty POST request for simple buttons like follow/unfollow"""
    submit = SubmitField('Submit')