'''
Script to modify database
'''
from app import db
from app.models import User, Project
projects = Project.query.all()     
#db.session.delete(projects[n])
db.session.commit()