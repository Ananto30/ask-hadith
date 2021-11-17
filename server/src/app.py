import json
import os

from bson import ObjectId
from flask import Flask, request, send_from_directory, jsonify
from flask.templating import render_template
from flask_cors import CORS
from flask_sslify import SSLify

from src.atlas_search import AtlasSearch
from src.mongo_client import MongoHadithClient


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


app = Flask(__name__, static_folder="../../frontend/build", static_url_path="/")
sslify = SSLify(app)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["CORS_HEADERS"] = "Content-Type"

atlas_client = AtlasSearch(os.getenv("ATLAS_URL"))
mongo_client = MongoHadithClient(os.getenv("MONGO_URL"))


@app.route("/api/search", methods=["GET"])
def search_api():
    sr = request.args.get("search")
    s = mongo_client.search_hadith(sr)
    json_res = JSONEncoder().encode(s)
    return json_res


@app.route("/api/v2/search", methods=["GET"])
def search_api_v2():
    sr = request.args.get("search")
    result = atlas_client.search_hadith(sr)
    return jsonify(result)


@app.route("/api/<collection_id>/<book>/<book_ref_no>", methods=["GET"])
def get_hadith_by_book_ref_api(collection_id, book, book_ref_no):
    return atlas_client.get_hadith_by_book_ref_no(collection_id, book, book_ref_no)


@app.route("/b/<collection_id>/<book>/<book_ref_no>", methods=["GET"])
def get_hadith_by_book_ref(collection_id, book, book_ref_no):
    s = atlas_client.get_hadith_by_book_ref_no(collection_id, book, book_ref_no)
    if s:
        return render_template("single_hadith.html", hadith=s)
    else:
        return render_template("404.html")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
