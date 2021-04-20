'''
Script to modify database
'''
from datetime import datetime, timedelta
import unittest
from app import create_app, db, cli
from app.models import User, Project, JoinRequest, ProjMember, Tag,\
                            Learning

import app.models as models
from config import Config
import os

from app import create_app
app = create_app()
app.app_context().push() # to accomodate updated app structure

''' 
    ! COMMON COMMANDS !
#Querying
[Model].query.filter_by(attr=...).first_or_404() # or just .first()

#Session
db.session.add(instance)
db.session.commit


'''


u = User.query.filter_by(username='susan').first_or_404()
proj = Project.query.filter_by(name='asd').first()
m = ProjMember(project_id = proj.id, rank_id=3,position_id=1)
m.user =u
m.project=proj
proj.members.append(m)
db.session.commit()
# r = JoinRequest(kind='request',msg='hello',status='pending')
# r.project = proj
# r.user = u
# u.send_request(proj, r)

# for i in u.proj_requests:
#     u.proj_requests.remove(i)
# db.session.commit()


# print(tag_names)
# print(Tag.query.filter_by(name='math').first())


#projects = Project.query.all()     

