from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, PasswordField, BooleanField, SubmitField, SelectField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length
from app.models import User, Project

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
    categories = ['Select one', 'learning','software development'] #these should be inherited
    learning_categories = ['None', 'Math']
    langs = ['Python', 'Java', 'javascript', 'HTML', 'C', 'C++','Ruby']

    name = TextAreaField('Give your project a name', validators=[
        DataRequired(), Length(min=1, max=60)])
    category = SelectField('Category', choices=categories, default=1)
    descr = TextAreaField('Describe your project', validators=[ 
        DataRequired(), Length(min=1, max=140)]) #make 1030
    #Learning
    learning_category = SelectField('learning category', choices=learning_categories, default=1)

    #Software Development
    lang = SelectField('Language', choices=['None'] + sorted(langs), default=1) #eventually would want to type it and it autofills since there are so many
    
    submit = SubmitField('Submit')

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