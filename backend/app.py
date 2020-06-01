import functools
import json
import os
import random
from pprint import pprint

from bson import ObjectId
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin
from flask_sslify import SSLify
from pymongo import MongoClient


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
sslify = SSLify(app)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

client = MongoClient(os.getenv("MONGO_URL"))
db = client.news
all_collections = ['bukhari_sunnah', 'muslim_sunnah', 'abudawud_sunnah', 'tirmidhi_sunnah', 'nasai_sunnah',
                   'ibnmajah_sunnah']


@functools.lru_cache(maxsize=512)
def search_hadith(search_string, limit=50):
    dbs = all_collections
    total = []
    for d in dbs:
        search = db[d].find({'$text': {'$search': search_string}}, {"score": {"$meta": "textScore"}})
        search.sort([('score', {'$meta': 'textScore'})]).limit(limit)
        search = list(search)
        total = total + search
    newlist = sorted(total, key=lambda k: k['score'], reverse=True)
    return newlist


def random_hadith(limit=3, dbs=[]):
    total = []
    for d in dbs:
        search = db[d].aggregate([{"$match": {"content": {"$ne": " "}}}, {'$sample': {'size': limit}}])
        search = list(search)
        total = total + search
    newlist = sorted(total, key=lambda k: random.random())
    return newlist


@app.route('/api/search', methods=['GET'])
def search_api():
    sr = request.args.get('search')
    s = search_hadith(sr)
    json_res = JSONEncoder().encode(s)
    return json_res


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
