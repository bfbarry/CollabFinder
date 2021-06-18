# Linear documentation of the coding

- from https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world
- He also has react stuff so check it out!
## Part I
`export FLASK_APP=collabsource.py`
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

## Part IV: Database
-`flask-SQLAlchemy` can be used by any database engine like MySQL

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

## PART X Email
- `flask-mail`, `pyjwt`

## PART XII DATE TIME
- using `flask-moment`

##  Part XIII: I18n and L10n
- `pip install flask-babel`
- `$ pybabel extract -F babel.cfg -k _l -o messages.pot .`
    - no need to commit this file
- `$ pybabel init -i messages.pot -d app/translations -l LANG` creates messages.po
- For empty `msgstr`s, need to manually input translations, then `pybabel compile -d app/translations`
<br> To make updates to language:
- `$ pybabel extract -F babel.cfg -k _l -o messages.pot .`
- `$ pybabel update -i messages.pot -d app/translations`

<br> cli.py
- enables us to scratch the above and use the `$ flask translate {init, update, compile}` shortcuts

## PART XIV:
- `guess_language-spirit`
- Did not do Ajax part (w/ Azure)


## Part XV  Better App Structure
current subsystems: 
- user auth
- error
- core app functionality (making projects)
Weakness: reusing global app, not good for testing multiple configurations <br>
So want an *application factory* function: this accepts a configuration object as an argument, and returns a Flask application instance, configured with those settings.

- Replace all url_for() with module.url e.g., `url_for('auth.login')`
- app --> current_app
- `python-dotenv` for environemtn variables

## PArt XVI: Full text search
- `$ brew install elasticsearch` 
    - To have launchd start elasticsearch now and restart at login: `$ brew services start elasticsearch`
        - currently using this. `(label: homebrew.mxcl.elasticsearch)`
    - w/o background service you can just run: `$ elasticsearch`
    - says "is a pre-release version of Elasticsearch and is not suitable for production"
- `$ pip install elasticsearch`

```python
>>> es.index(index='my_index', id=1, body={'text': 'this is a test'})
>>> es.search(index='my_index', body={'query': {'match': {'text': 'this test'}}})
>>> es.indices.delete('my_index')
```
- Added `ELASTICSEARCH_URL=http://localhost:9200` to `.env` which is in root dir, if this doesn't work, do this in command line.
- create `search.py` after setting `__searchable__` attribute to models.
    - this .py file can be rewritten to acommodate different search engines
    - currently, `__searchable__ = ['category','name','descr']` but might want to reduce to just name and descr when implementing a "browse by category" option
    - new id that is same as old one overwrites the last one in an index
- Want to trigger indexing calls automatically as changes to DB are made
- Create a Mixin class to integrate Elasticsearch with SQLAlchemy

## BOOK CHAPTER 9 USER ROLES:
- binary role representation and bitwise and to verify
- adding `__init__` to user to assign default role
- added same idea to `Rank()` and `ProjMember()`
- decorators for permissions (not sure how to use yet)

## Common Flask errors
>"write each part of the application without making any assumptions about how the other parts work, and this enables me to write modular and robust applications that are easier to extend and to test, and are less likely to fail or have bugs."
- Did you remember to migrate and upgrade after changing DB in models.py?
- Maybe: Order of code
- If db upgrade error and want to revert, downgrade
- If change var name, remember to alter_table() in migration script
- use batch to drop column:
```python
with op.batch_alter_table("project") as batch_op:
        batch_op.drop_column('descr')
```
- If "None has no avatar" error, this is because some post was created by Null
- To print to console, include `flush=True` in print args
- must use absolute file paths within scripts (no '`../`')
- If form not validating on submit, something may be wrong in the form
    - if declaring unused fields in form but not putting them in web page
- `sqlalchemy.orm.exc.ObjectDeletedError` if have even commented out error giving code in html
- Make sure database row being used has updated database and model features before using it to test
- **<span style="color:orange">∆! ALWAYS MIGRATE AND UPGRADE WITH DB CHANGES</span>** otherwise it may freeze and no longer recognize changes
    - in that case flask shell - > db.drop_all() db.create_all() shell: flask db init, migrate, upgrade.


## Other notes
- "Because GET requests are harder to protect against CSRF, they should only be used on actions that do not introduce state changes."
- [Why models have no constructors](https://stackoverflow.com/questions/20460339/flask-sqlalchemy-constructor): "Flask-SQLAlchemy's base model class (which is also SQLAlchemy's declarative base class) defines a constructor that just takes **kwargs and stores all the arguments given, so it isn't really necessary to define a constructor."
- [Calling raw SQL commands](https://stackoverflow.com/questions/17972020/how-to-execute-raw-sql-in-flask-sqlalchemy-app?rq=1)


WHAT WE CAN OFFER THAN FINDCOLLABS DOESN'T
- random matching with project
- Learning projects for self teaching
- Data science category 
- Emphasis of emergence of a product from interdisciplinary collaboration.
- restrict by geographical area or school (the latter is important as this is our audience)
- No chat – leave that to discord or slack
- Really cater to more than just start ups and coding projects
- Search function is not restricted to existing tags.
- No ratings but rather projects worked. And if someone sucks, 

# TEST USERS
susan: cat
bo: 1

# Other resources
- https://stackoverflow.com/questions/57332069/how-to-dynamically-create-fields-in-form-based-on-user-input-from-selectfield
- [Dynamic select video](https://www.youtube.com/watch?v=I2dJuNwlIH0)

# WHERE I LEFT OFF

3/9/21: FIXD added Learning(), it nor project will add to DB.  Also printing to console in submit scope not working.

3/14/21: find other way to get `spec_arg_names` in index, such as a dictionary (since variables and positions change too much)

- Inheritance good for Learning, need to extend to the other subclasses 
- Need more efficient way to get args and instantiate class in routes
- Need to to figure out other db relationships like memebrs
- Search bar

3/23/21
- Routes.py efficient instantiating
- Front end efficient div show/hide
- Next: search and project page

3/25/21
- CSS messed up for project stream relative to project creation form

# Details of my code
- sub project variables (e.g. those of `Learning`) should be named the same as those in `ProjectForm()` in order for `routes.py` to work