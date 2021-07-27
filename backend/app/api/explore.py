from datetime import datetime
from flask import request, g, jsonify
from flask_babel import _
from app import db
from app.models import User, Project, ProjMember, JoinRequest, ScrumTask, Tag, Position, proj_categories, \
                            Learning #Project subclasses
from app.api import bp
from app.api.auth import token_auth

@bp.route('/explore/projects/<mode>', methods=['GET'])
def explore_projects(mode):
    # TODO call project api endpoint
    ...