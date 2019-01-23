import random

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

def targeting_search_audience_size(item):
    return item['audience_size']

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/result_list', methods=['POST', 'GET'])
def result_list():
    interest_list = [item for sublist in request.form.listvalues() for item in sublist]
    app.logger.debug(interest_list)

    # Obtain a large list of interests
    results = []
    stored = []
    for it in range(0,3):
        nb_keywords = 1
        for idx in range(0,len(interest_list),nb_keywords):
            items = TargetingSearch.search(params={
                'interest_list': interest_list[idx:idx+nb_keywords],
                'type': TargetingSearch.TargetingSearchTypes.interest_suggestion,
                'limit': 8,
            })

            results += [interest for interest in items if interest['name'] not in stored]
            stored += [interest['name'] for interest in items if interest['name'] not in stored]
        random.shuffle(stored)
        interest_list = stored

    results.sort(key=targeting_search_audience_size)
    results = list(map(lambda x: {
        'name': x.get('name'),
        'audience_size': x.get('audience_size')
    }, results))

    response = app.response_class(
        response = json.dumps(results),
        status = 200,
        mimetype = 'application/json'
    )
    return response

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
