from flask import current_app

def add_to_index(index, model):
    if not current_app.elasticsearch:
        return
    payload = {}
    for field in model.__searchable__:
        if field == 'tags':
            # if len([tag.name for tag in model.tags]) == 0: continue
            # tags = model.tags
            payload[field] = getattr(model, 'tag_list') #[t.name for t in tags]
        else:
            payload[field] = getattr(model, field)
    current_app.elasticsearch.index(index=index, id=model.id, body=payload)

def remove_from_index(index, model):
    '''in case project is deleted'''
    if not current_app.elasticsearch:
        return
    current_app.elasticsearch.delete(index=index, id=model.id)

def query_index(index, query, page, per_page):
    '''multi_match can search across multiple fields'''
    if not current_app.elasticsearch:
        return [], 0
    search = current_app.elasticsearch.search(
        index=index,
        body={'query': {'multi_match': {'query': query, 'fields': ['*']}}, # '*' makes search generic
              'from': (page - 1) * per_page, 'size': per_page})
    ids = [int(hit['_id']) for hit in search['hits']['hits']]
    return ids, search['hits']['total']['value']