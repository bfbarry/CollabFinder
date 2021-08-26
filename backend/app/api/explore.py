from datetime import datetime
from flask import request, g, jsonify
from flask_babel import _
from app import db
from app.models import User, Project, ProjMember, JoinRequest, ScrumTask, Tag, Position, Resource, PROJ_CATEGORIES,\
                            Learning #Project subclasses
from app.api import bp
from app.api.auth import token_auth
from ..utils import recommender

def recommend_projects(user_id):
    """not an endpoint; used in explore_projects"""
    # TODO is adding to database necessary if online?
    usr = User.query.get(user_id)
    ordered_recs = recommender.cbf(usr, 'jaccard_index')
    # for rank, id in enumerate(ordered_recs):
    #     rec = UserProjRecommendation(user_id=user_id, project_id=id, rank=rank)
    #     db.session.add(rec)
    #     db.session.commit()
    return ordered_recs

@bp.route('/explore/projects/<user_id>/<mode>', methods=['GET'])
def explore_projects(user_id, mode):
    """mode: 'recommended', 'recent', category"""
    # TODO call project api endpoint

    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    user = User.query.get(user_id)
    unwanted_id = [p.project_id for p in user.proj_requests] + [p.project_id for p in user.member_of] # projects user is in or requested
    if mode == 'recommended':
        ids = recommend_projects(user_id)
        q = Project.query.filter(Project.id.in_(ids)) # make sure order is conserved
    elif mode in PROJ_CATEGORIES.keys(): #Redundant? Should this be filtered in 
        q = Project.query.filter_by(category='_'.join(mode.split())).order_by(Project.timestamp.desc())
    elif mode in ['recent','all']: # janky, see above
        q = Project.query.filter(Project.id.notin_(unwanted_id)).order_by(Project.timestamp.desc())

    data = Project.to_collection_dict(q, page, per_page, 'api.explore_projects', user_id=user_id, mode=mode)
    data['_meta']['categories'] = ['all'] + list(PROJ_CATEGORIES.keys())
    return jsonify(data)

@bp.route('/explore/resources/<user_id>/<mode>', methods=['GET'])
def explore_resources(user_id, mode):
    """mode: 'recommended', 'recent', category"""
    page = request.args.get('page',1,type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    user = User.query.get(user_id)
    if mode == 'recommended':
        return {}
        ids = recommend_projects(user_id)
        q = Project.query.filter(Project.id.in_(ids)) # make sure order is conserved
    elif mode in PROJ_CATEGORIES.keys(): #Redundant? Should this be filtered in 
        q = Resource.query.filter_by(category='_'.join(mode.split())).order_by(Resource.timestamp.desc())
    elif mode in ['recent','all']: # janky, see above
        q = Resource.query.order_by(Resource.timestamp.desc())

    data = Resource.to_collection_dict(q, page, per_page, 'api.explore_resources', user_id=user_id, mode=mode)
    data['_meta']['categories'] = ['all'] + list(PROJ_CATEGORIES.keys())
    return jsonify(data)