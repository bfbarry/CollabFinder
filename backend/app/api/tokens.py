from flask import jsonify, request
from app import db
from app.api import bp #, jwt
from app.api.auth import basic_auth, token_auth
from app.models import User

@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = basic_auth.current_user().get_token()
    db.session.commit()
    user_data = basic_auth.current_user().id
    return jsonify({'token': token, 'user_id':user_data})

@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    token_auth.current_user().revoke_token()
    db.session.commit()
    return '', 204