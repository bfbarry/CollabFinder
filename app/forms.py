from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField, BooleanField, SubmitField, SelectField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length
from app.models import User, Project
#from routes import proj_categories

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField(
        'Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

    def validate_username(self, username):
        """validate_<field_name> are WTForms custom validators """
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')

class ProjectForm(FlaskForm):
    """Create a new project, on /index"""
    # SelectField options
    option1 = 'Select one'
    categories = [option1] + ['learning','software development'] # test version, see below
    #categories = [option1] + sorted(proj_categories.keys) 
    proj_settings = (option1,) + ("casual", "serious/professional")
    skill_lvls = (option1,) + ('any','beginner','intermediate','advanced')
    ## proj spec
    learning_categories = [option1] + sorted(['math', 'computer science', 'foreign language', 'linguistics', 'data science & machine learning', 'statistics', 'physics'])
    pace_types = (option1,) + ("custom-pace","self-paced", "quarter","semester")
    langs = [option1] + ['Python', 'Java', 'javascript', 'HTML', 'C', 'C++','Ruby','Scala']

    #Basic form fields
    name = TextAreaField('Give your project a name', validators=[
        DataRequired(), Length(min=1, max=60)])
    category = SelectField('Category', choices=categories, default=1)
    descr = TextAreaField('Describe your project', validators=[ 
        DataRequired(), Length(min=1, max=140)]) #make 1030
    skill_level = SelectField('Skill Level', choices=skill_lvls, default=1)
    setting = SelectField('Setting', choices=proj_settings, default=1)    
    
    #Learning
    learning_category = SelectField('Learning category', choices=learning_categories, default=1)
    pace = SelectField('Learning pace', choices=pace_types, default=1)

    #Software Development
    lang = SelectField('Language', choices=['None'] + sorted(langs), default=1) #eventually would want to type it and it autofills since there are so many
    
    submit = SubmitField('Create Project')

class EditProfileForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    about_me = TextAreaField('About me', validators=[Length(min=0, max=140)])
    submit = SubmitField('Submit')

    def __init__(self, original_username, *args, **kwargs):
        super(EditProfileForm, self).__init__(*args, **kwargs)
        self.original_username = original_username

    def validate_username(self, username):
        if username.data != self.original_username:
            user = User.query.filter_by(username=self.username.data).first()
            if user is not None:
                raise ValidationError('Please use a different username.')

class EmptyForm(FlaskForm):
    """Empty POST request for simple buttons like follow/unfollow"""
    submit = SubmitField('Submit')