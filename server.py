from flask import Flask
from flask import request
from flask import render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/seed_list', methods=['POST', 'GET'])
def seed_list():
    if request.method == 'POST':
        request.form['interest-1']
        return render_template('seed_list.html', interests=request.form.lists())
    return render_template('seed_list.html')