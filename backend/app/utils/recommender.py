from ..models import User, Project, ProjMember, JoinRequest, ScrumTask, Tag, Position, PROJ_CATEGORIES, \
                            Learning #Project subclasses

from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import numpy as np

def jaccard_index(*args):
    """takes in two lists"""
    l1, l2 = map(set, args)
    try:
        return len(l1 & l2) / len(l1 | l2)
    except: 
        return 0

def cosine_sim(v1,v2):
    return (v1@v2)/(np.linalg.norm(v1)*np.linalg.norm(v2))

def cbf(user, func, model=None, fake_data=False):
    """performs collaborative based filtering 
    func: 'jaccard_index' or 'cosine_similarity'
    if func == 'cosine_sim':
        model: doc2vec model (trained on project and/or user tags)
    returns: list of projects ordered by similarity"""

    if not fake_data:
        user_tags = [t.name for t in user.tags]
        unwanted_id = [p.project_id for p in user.proj_requests] + [p.project_id for p in user.member_of]
        projects = Project.query.filter(Project.id.notin_(unwanted_id))
        project_features = {p.id : [t.name for t in p.tags] for p in projects}
        scores = {p.id : 0 for p in projects}
    else:
        user_tags = user
        project_features = fake_data
        scores = {p:0 for p in projects.keys()}
        
        
    if func == 'cosine_sim':
        if model == None:
            raise Exception( "Using cosine_sim expects a model")
        proj_vectors = model.docvecs.vectors_docs
        user_tags = model.infer_vector(user_tags)
        project_features = {p:proj_vectors[i] for i, p in enumerate(projects.keys())}
        scores = {p:0 for p in projects.keys()}
    
    for k,v in project_features.items():
        s = globals()[func](user_tags,v) #make sure globals ok
#         if s > 0.4: # IMPORTANT, maybe normalize scores by highest first
        scores[k] = s
#         else:
#             del scores[k]
    #can also use argsort
    sorted_projs = [i[0] for i in sorted(scores.items(), key=lambda item: item[1], reverse=True) ]
    return sorted_projs
