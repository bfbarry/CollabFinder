from app import create_app, db, cli
from app.models import User, Project

app = create_app()
cli.register(app)

@app.shell_context_processor
def make_shell_context():
    """ adds the following instances and models to the shell session:"""
    return {'db': db, 'User': User, 'Project': Project}