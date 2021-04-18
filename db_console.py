'''
Script to modify database
'''
from datetime import datetime, timedelta
import unittest
from app import create_app, db, cli
from app.models import User, Project, JoinRequest, Tag,\
                            Learning

import app.models as models
from config import Config
import os

from app import create_app
app = create_app()
app.app_context().push() # to accomodate updated app structure

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# db.init_app(app)

# p = Project.query.filter_by(id=22)     
# print(p)
# cs = Tag(name='computer science')
# db.session.add(cs)
# db.session.commit()

u = User.query.filter_by(username='susan').first_or_404()
# proj = Project.query.filter_by(name='asd').first()
# r = JoinRequest(kind='request',msg='hello',status='pending')
# r.project = proj
# r.user = u
# u.send_request(proj, r)

for i in u.proj_requests:
    u.proj_requests.remove(i)
db.session.commit()


# print(tag_names)
# print(Tag.query.filter_by(name='math').first())


#projects = Project.query.all()     

