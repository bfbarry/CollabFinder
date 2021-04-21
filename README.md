# Collab Finder

## Set up
### **Packages**
```shell
$ source venv/bin/activate
$ pip install -r requirements.txt
```

### **Elasticsearch (search engine)**

```shell
$ brew install elasticsearch
```

Then, run elasticsearch:
- Run elasticsearch in background perpetually via launchd: `$ brew services start elasticsearch`
- Or w/o background service you can just run: `$ elasticsearch`
- check that it works @ http://localhost:9200
    - should return JSON
    - may take a minute or two to load after starting elasticsearch

### **Running flask**
To make debugging easier:
```shell
$ export FLASK_DEBUG=1
``` 
You MIGHT have to run this:
```
$ export FLASK_APP=collabfinder.py
```
To start server:
```shell
$ flask run
```

ranks:
<br>in flask shell:
```python
Rank.insert_ranks()
Role.insert_roles()
```

### **Test usernames:passwords**
susan: cat<br>
bo: 1

### **Handy VSCode Extensions**
- SQLite (allows you to look at database structure by right clicking app.db)

### **Resources**
progress_doc.md is where I try to record step by step how I build this website as I follow [this tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
