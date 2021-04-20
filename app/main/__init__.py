from flask import Blueprint

bp = Blueprint('main', __name__)

from app.main import routes
from ..models import ProjPerm, SitePerm

@bp.app_context_processor
def inject_permissions(proj=None):
    if proj:
        return dict(Permission=ProjPerm)
    else:
        return dict(Permission=SitePerm)