from functools import wraps
from flask import abort
from flask_login import current_user
from .models import ProjPerm, SitePerm

def perm_required(perm,proj=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args,**kwargs):
            if not current_user.can(perm, proj):
                abort(403)
            return f(*args,**kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    return perm_required(SitePerm.ADMIN)(f)

def proj_admin_required(f,proj):
    '''not sure if this would work'''
    return perm_required(ProjPerm.ADMIN,proj)(f)