'''
Script to modify database
'''
from datetime import datetime, timedelta
import unittest
from app import create_app, db, cli
from app.models import User, Role, Project, JoinRequest, ProjMember, Tag, ProjPerm,\
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
db.session.commit()
db.session.delete()

'''


u = User.query.filter_by(username='susan').first_or_404()
proj = Project.query.filter_by(name='Bo project').first()
print(u.can(ProjPerm.ADMIN,proj))

# m = ProjMember(user_id=u.id, rank_id=3, project_id = proj.id,position_id=2)
# u.member_of.append(m)
# db.session.commit()
# r = JoinRequest(kind='request',msg='hello',status='pending')
# r.project = proj
# r.user = u
# u.send_request(proj, r)




# print(tag_names)
# print(Tag.query.filter_by(name='math').first())


#projects = Project.query.all()     

