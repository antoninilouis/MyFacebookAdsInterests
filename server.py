from flask import Flask
from flask import request
from flask import render_template

from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.targetingsearch import TargetingSearch

app = Flask(__name__)
app.config.from_envvar('APP_CONFIG')

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/seed_list', methods=['POST', 'GET'])
def seed_list():
    app_id = app.config['APP_ID']
    app_secret = app.config['APP_SECRET']
    access_token = app.config['ACCESS_TOKEN']
    FacebookAdsApi.init(app_id, app_secret, access_token)

    interest_list = [request.form['interest-1'], request.form['interest-2'], request.form['interest-3']]

    results = TargetingSearch.search(params={
        'interest_list': interest_list,
        'type': TargetingSearch.TargetingSearchTypes.interest_suggestion,
        'limit': 45,
    })

    if request.method == 'POST':
        return render_template('seed_list.html', results=results)
    return render_template('seed_list.html')