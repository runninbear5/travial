from flask_restful import Api, Resource, reqparse
from flask import request
import util
class GetScore(Resource):
	def get(self):
		print(request.json)
		return {}

	def post(self):
		json = request.json
		return util.score_countries_by_criteria(json)

class GetActivities(Resource):
	def get(self):
		activities = util.getActivities()
		return {"activities": list(activities.keys())}
	
	def post(self):
		return "none"

  
