import json
from flask import jsonify, request
from app import db
from app.api import bp #, jwt
from app.api.auth import basic_auth, token_auth
from flask_jwt_extended import create_access_token, current_user, get_jwt_identity, jwt_required, JWTManager
from app.models import User

@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = basic_auth.current_user().get_token()
    db.session.commit()
    user_data = basic_auth.current_user().id
    return jsonify({'auth_token': token, 'user':user_data})

@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    token_auth.current_user().revoke_token()
    db.session.commit()
    return '', 204

### USING JWT ###
@bp.route('/token', methods=['POST'])
def login():
    """Create a route to authenticate users and return JWTs"""
    username = request.json.get('username',None) #TODO CHANGE TO EMAIL
    password = request.json.get('password',None)
    user = User.query.filter_by(username=username).first_or_404()
    if not user or not user.check_password(password):
        return jsonify("Wrong username or password"), 401
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)


@bp.route('/stuff', methods=["GET"])
@token_auth.login_required
def stuff():
    return jsonify(f'hello! {token_auth.current_user().username}')