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

#### Creating The Migration Repository
`$ flask db init`
First database migration: `$ flask db migrate -m "[new table name e.g.,] table"` (generates new migration script [where is this script?].  Also when it detects new table name is it from the -m message?)<br>
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