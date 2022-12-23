from flask import Blueprint

bp = Blueprint('api', __name__)

from app.api import user, project, tokens, forms, search, explore
# from ..models import ProjPerm, SitePerm

# @bp.app_context_processor
# def inject_permissions(proj=None):
#     if proj:
#         return dict(Permission=ProjPerm)
#     else:
#         return dict(Permission=SitePerm)