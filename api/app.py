from flask import Flask, request
import util
from flask_cors import CORS
# from flask import request

app = Flask(__name__)
CORS(app)
@app.route("/")
def serve():
    return "API BACKEND"

@app.route("/flask/activities", methods=["GET"])
def activities():
    acts = util.getActivities()
    return {"activities": list(acts.keys())}

@app.route("/flask/scores", methods=["POST"])
def scores():
    json = request.json
    return util.score_countries_by_criteria(json)

if __name__ == '__main':
    app.run()