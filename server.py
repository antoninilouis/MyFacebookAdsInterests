from flask import Flask
from flask import request
from flask import render_template

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/login', methods=['GET'])
def login():
    error = None
    # the code below is executed if the request method
    # was GET or the credentials were invalid
    return render_template('hello.html', error=error)