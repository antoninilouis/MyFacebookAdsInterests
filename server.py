from flask import Flask
from flask import request
from flask import render_template
from flask import json

from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.targetingsearch import TargetingSearch

app = Flask(__name__)
app.config.from_envvar('APP_CONFIG')

# Setup the API calls
app_id = app.config['APP_ID']
app_secret = app.config['APP_SECRET']
access_token = app.config['ACCESS_TOKEN']
FacebookAdsApi.init(app_id, app_secret, access_token)

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/seed_list', methods=['POST', 'GET'])
def seed_list():
    form = request.form.copy()
    seed = form.get('seed')
    if seed != None:
        del form['seed']
        interest_list = list(map(lambda x: form.get(x), form))

    curated = form.get('curated')
    if curated != None:
        del form['curated']
        interest_list = list(map(lambda x: form.get(x), form))

    items = TargetingSearch.search(params={
        'interest_list': interest_list,
        'type': TargetingSearch.TargetingSearchTypes.interest_suggestion,
        'limit': 45,
    })

    results = list(map(lambda x: x.get('name'), items))

    if request.method == 'POST':
        return render_template('seed_list.html', results=results)
    return render_template('seed_list.html')

@app.route('/adinterest')
def adinterest():
    term = request.args.get('term')

    items = TargetingSearch.search(params={
        'q': term,
        'type': TargetingSearch.TargetingSearchTypes.interest,
        'limit': 10,
    })

    results = list(map(lambda x: x.get('name'), items))

    response = app.response_class(
        response = json.dumps(results),
        status = 200,
        mimetype = 'application/json'
    )
    return response
