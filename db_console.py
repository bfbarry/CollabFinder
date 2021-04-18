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

u = User.query.get(1)
r = JoinRequest(kind='request',msg='hello',status='pending')
r.project = Project.query.filter_by(name='116').first()
r.user = u
u.proj_requests.append(r)

db.session.commit()


# print(tag_names)
# print(Tag.query.filter_by(name='math').first())


#projects = Project.query.all()     

