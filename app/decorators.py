from functools import wraps
from flask import abort
from flask_login import current_user
from .models import ProjPerm, SitePerm

def proj_perm_required(perm,proj):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args,**kwargs):
            if not current_user.can(perm, proj):
                abort(403)
            return f(*args,**kwargs)
        return decorated_function
    return decorator

def proj_admin_required(f):
    return proj_perm_required(ProjPerm.ADMIN)(f)