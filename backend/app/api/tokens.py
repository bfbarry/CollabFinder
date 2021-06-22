import json
from flask import jsonify, request
from app import db
from app.api import bp #, jwt
from app.api.auth import basic_auth, token_auth
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

# @bp.route('/tokens', methods=['POST'])
# @basic_auth.login_required
# def get_token():
#     token = basic_auth.current_user().get_token()
#     db.session.commit()
#     return jsonify({'token': token})

@bp.route('/token', methods=['POST'])
def login():
    """Create a route to authenticate users and return JWTs"""
    username = request.json.get('username',None) #TODO CHANGE TO EMAIL
    password = request.json.get('password',None)
    if username != 'test' or password != 'test':
        return jsonify({'msg': 'Bad username or password'}), 401
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    token_auth.current_user().revoke_token()
    db.session.commit()
    return '', 204