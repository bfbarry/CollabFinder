from flask import request, g, jsonify
from flask import current_app, url_for
from app import db
from app.models import User, Project
from app.api import bp
from app.api.auth import token_auth

@bp.route('/search/<q>', methods=['GET'])
def search(q):
    # TODO: FRONT END - redirect or do nothing if empty
    input_data = q
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 25, type=int), 100)

    projects, total = Project.search(q, page,
                               current_app.config['PROJECTS_PER_PAGE'])

    data = Project.to_collection_dict(projects, page, per_page, 'api.search', q=q)
    return jsonify(data)