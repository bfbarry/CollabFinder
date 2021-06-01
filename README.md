# CollabSource

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
$ export FLASK_DEBUG=1 # this can also be in your .bash_rc or .bash_profile to automatically set this at start up
``` 
You MIGHT have to run this for set up:
```
$ export FLASK_APP=collabsource.py
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

### API commands
GET
```bash
curl -X GET -H "Content-Type: application/json" http://127.0.0.1:5000/api/users/1
```
PUT
```bash
curl -X PUT -H "Content-Type: application/json" http://127.0.0.1:5000/api/test/put --data '{"name":"mochi"}'
```

### **Handy VSCode Extensions**
- SQLite (allows you to look at database structure by right clicking app.db)

### **Resources**
progress_doc.md is where I try to record step by step how I build this website as I follow [this tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
