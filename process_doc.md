# Linear documentation of the coding

- from https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world
- He also has react stuff so check it out!
## Part I
`export FLASK_APP=collabfinder.py`
## Part IV: Database
`$ pip install flask-sqlalchemy`<br>
`$ pip install flask-migrate`

\>>> config.py Flask-SQLAlchemy configuration

\>>>app/__init__.py: Flask-SQLAlchemy and Flask-Migrate initialization

\>>>app/models.py: User database model (class User())

<span style="color:orange"> How do you db downgrade after an error without dropping tables?  How do you alter columns when you have old columns and new columns and data in both? </span>

#### Creating The Migration Repository
`$ flask db init`
First database migration: `$ flask db migrate -m "[new table name e.g.,] table"` (generates new migration script [where is this script?].  <br>
Apply changes to database: `$ flask db upgrade`

#### DB relationships
Primary key has: `db.relationship(...)` Foreign key has `db.Column(..., db.ForeignKey)`

#### Accessing db in python
\>>>db.session<br>
\>>>db.session.commit()<br>
\>>>User.query.all()<br>
\>>>User.query.get(id) <br>
Creating a post <br>
\>>> u = User.query.get(1)<br>
\>>> p = Post(body='my first post!', author=u)<br>
• confused how classes don't have `__init__`?<br>

added shell context

- As of 1/25/21, want to understand how my Python database class relates to the SQL database (does `Project` inherit both `db.Model` and `ProjectDB`?)
    - How inheritance works in the database?
        - For example would the Project table have all the attributes from its subclasses, where some (col, row) values are blank?
    - Where makeProject() fits in all this ()
    - How multidimensional objects can be stored in a database

## Part V Crypto

`$ pip install flask-login` <br>
`$ pip install email-validator` <br>
"Flask-Login keeps track of the logged in user by storing its unique identifier in Flask's user session, a storage space assigned to each user who connects to the application" <br>
- then add to `routes.py`
- `@login_required` if you want to protect a page
<br>
∆ Confused how in routes.py functions, render_template occurs at the end. How is all the data inputted then? (e.g username when registering) What is it returning? I guess that's where the decorators come in?

## Part VI Prof pages
- user() in routes have a parameter because it is passed in from the decorator (when you go to that link)
- when linking in base.html, use current_user.username (dynamic)
- What are validators again?
- What is .data attribute in routes?

## Part VII Debugging
`$ export FLASK_DEBUG=1` <br>

to test email server:
- `$ python -m smtpd -n -c DebuggingServer localhost:8025` in new shell
- `export MAIL_SERVER=localhost` and `MAIL_PORT=8025`
- can also set up an gmail server (not always safe, refer to [here](https://support.google.com/accounts/answer/6010255?hl=en)):<br>
`export MAIL_SERVER=smtp.googlemail.com`<br>
`export MAIL_PORT=587`<br>
`export MAIL_USE_TLS=1`<br>
`export MAIL_USERNAME=<your-gmail-username>`<br>
`export MAIL_PASSWORD=<your-gmail-password>`<br>

## Part VIII Followers chapter

- Though I do not necessarily want to focus on followers, this chapter is important for understanding the X to X, where X in {One, Many} relationships, as database values cannot be lists
- In my case, users will have followers, and projects will have "followers" (but more like a star on github) and _members_
     - so the latter is a Many to Many
        - Can't be done by adding foreign keys to the existing tables.
        - Thus association tables w/ two foreign keys (member to project)
        - **<span style="color:orange">∆! How to assign different roles to members?</span>**
            And how to assign multiple creators?
        - **<span style="color:orange">∆! How to establish [many to many relationship](https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/) in Users()?</span>**
    - The former is as well but w/ self-referential many to many (user to user)
        - "Each record in this table represents one link between a follower user and a followed user. "
- What's lazy?

## Part IX Pagination
- Why doesn't PostForm() refer to Post() class? Confused on how some forms use the class, others use just a form that is used by object in routes.py
- TextAreaField Length(): is it characters or words?
- Redirect after submission of post: "this simple trick is called the Post/Redirect/Get pattern. It avoids inserting duplicate posts when a user inadvertently refreshes the page after submitting a web form."
- **<span style="color:orange"> How do you get multiple forms on a page?</span>** 

## Common errors
- Did you remember to migrate and upgrade after changing DB in models.py?
- Maybe: Order of code
- If db upgrade error and want to revert, downgrade
- If change var name, remember to alter_table() in migration script
- use batch to drop column 


## Other notes
- "Because GET requests are harder to protect against CSRF, they should only be used on actions that do not introduce state changes."
- [Why models have no constructors](https://stackoverflow.com/questions/20460339/flask-sqlalchemy-constructor): "Flask-SQLAlchemy's base model class (which is also SQLAlchemy's declarative base class) defines a constructor that just takes **kwargs and stores all the arguments given, so it isn't really necessary to define a constructor."
- [Calling raw SQL commands](https://stackoverflow.com/questions/17972020/how-to-execute-raw-sql-in-flask-sqlalchemy-app?rq=1)

## Business matters
- Crowdfight is doing something similar, for science/research projects
# Chapters to look at:
- Facelift
- Better applicaiton structure
- Full text search
- 

# TODO in code
- Database
    - Adding each project type to database 
    - How to clear db version history
    - How to add location/geo
    - Make sure instantiating a project subclass + adding it to db also adds a Project 
- Web stuff
    - Adding javascript to simplify project type display
    - add nav bar to base.html
    - Look into API, react
Higher lever
    - Private projects

# Website design

Form: skill level should be a slider

Front page:<br>
Find a project search bar <br>
or <br>
"Start a project" button (equally big)

- Follow topics/interests with feed

Don't show followed projects if anonymous user

# TEST USERS
susan: cat
bo: 1

# Other resources
- https://stackoverflow.com/questions/57332069/how-to-dynamically-create-fields-in-form-based-on-user-input-from-selectfield
- [Dynamic select video](https://www.youtube.com/watch?v=I2dJuNwlIH0)

# WHERE I LEFT OFF

3/9/21: added Learning(), it nor project will add to DB.  Also printing to console in submit scope not working.

3/14/21: find other way to get `spec_arg_names` in index, such as a dictionary (since variables and positions change too much)
- When `Learning` inherits from `Project`, get this:

```
/Users/brianbarry/Desktop/AppsComputing/CollabFinder/venv/lib/python3.7/site-packages/sqlalchemy/orm/mapper.py:1899: SAWarning: Implicitly combining column project.id with column learning.id under attribute 'id'.  Please configure one or more attributes for these same-named columns explicitly.
 util.warn(msg)
```