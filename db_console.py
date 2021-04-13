'''
Script to modify database
'''
from datetime import datetime, timedelta
import unittest
from app import create_app, db, cli
from app.models import User, Project,\
                            Learning


from config import Config
import os

from app import create_app
app = create_app()
app.app_context().push() # to accomodate updated app structure

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# db.init_app(app)

# p = Project.query.filter_by(id=22)     
# print(p)
proj_sub = Learning.query.get(12)
print(proj_sub.pace)

proj_dict = {}
#spec_args = [attr for attr in list(vars(Learning)) if not attr.startswith("_")][2:]
# for a in spec_args:
#     print(a)
    #exec(f'proj_dict[a] = proj_sub.{a}')

print(proj_dict)

#projects = Project.query.all()     
#db.session.delete(projects[n])
#db.session.commit()