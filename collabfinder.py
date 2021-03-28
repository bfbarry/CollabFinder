from app import app, db, cli
from app.models import User, Project

@app.shell_context_processor
def make_shell_context():
    """ adds the following instances and models to the shell session:"""
    return {'db': db, 'User': User, 'Project': Project}