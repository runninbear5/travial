from inspect import getcallargs
from itertools import count
from firebase import Firebase
import requests, json, os, csv
from amadeus import Client, ResponseError
from dotenv import load_dotenv
from datetime import datetime
db = Firebase()

#Database restruction

# DO NOT. FUCKING RUN. THIS FUNCTION. EVER AGAIN.

# for country in db.getCountries():
# 	if country == "Congo" or country == "Greenland":
# 		dct = db.readCountryData(country)
# 		dct.pop("Name")

# 		dct = {x:y for x,y in dct.items() if y != 0}

# 		newDct = {
# 			"Name": country,
# 			"Activities": dct,
# 			"Capital": ""
# 		}
# 		db.deleteCountry(country)
# 		db.writeCountryData(country, newDct)
# print(db.getActivities("Greenland"))

load_dotenv()

def AddingCountryInfoSubNode():
	for country in db.getCountries():
		if country == "Congo" or country == "Greenland":
			continue


		dct = db.readCountryData(country)
		noCap = dct["Capital"]
		noName = dct["Name"]
		dct.pop("Capital")
		dct.pop("Name")
		dct["Info"] = {}
		dct["Info"]["Capital"] = noCap
		dct["Info"]["Country Code"] = ""
		dct["Info"]["Name"] = noName

		db.writeCountryData(country, dct)


def CreateActivites():
	countries = db.getCountries()
	activities = {}
	for country in countries:
		acts = db.getActivities(country)
		for act in acts:
			if act not in activities:
				activities[act] = []
			activities[act].append({"country":country, "score": acts[act]})

	for act in activities:
		db.pushActivitiesData(act, activities[act])


def TemperatureFilling():
	countries = db.getCountries()
	dataToLoad = {}
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

	with open('weather_data.csv') as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=',')
		line_count = 0

		for row in csv_reader:
			if line_count != 0: # skips first line
				country = row[0]
				for key, m in enumerate(months):
					if country not in dataToLoad:
						dataToLoad[country] = {}
					dataToLoad[country][m] = (float(row[key+2]) * 9/5) + 32
			line_count = line_count + 1
	
	for country in countries:
		db.writeWeatherInfo(country, dataToLoad[country])


def AirportFilling():
	countries = db.getCountries()
	f = open("airports.json")
	airports = json.load(f)
	dataToLoad = {}
	for air in airports:
		if air["country"] not in dataToLoad:
			dataToLoad[air["country"]] = []

		dataToLoad[air["country"]].append({"City": air["city"], "Code": air["code"]})
	for country in countries:
		if country in dataToLoad:
			db.writeAiportInfo(country, dataToLoad[country])

# AirportFilling()

def getActivities():
	return db.getAllActivities()

def score_countries_by_criteria(received_data):

	weather_dictionary = received_data["Weather"]
	activity_dictionary = received_data["Activities"]

	country_scores = {}
	countries = db.countries.get()

	start_month = datetime.strptime(received_data["StartDate"], '%Y-%m-%dT%H:%M:%S.%fZ').strftime("%B")
	end_month = datetime.strptime(received_data["EndDate"], '%Y-%m-%dT%H:%M:%S.%fZ').strftime("%B")

	for country_name in db.getCountries():
		score = getIndvidiualCountryScore(countries[country_name], 
				weather_dictionary, activity_dictionary, start_month, end_month)
		country_scores[country_name] = round(100 * score, 2)

	return ({k: v for k, v in sorted(country_scores.items(), key=lambda item: item[1], reverse=True)})

def weatherScore(temperature_preference, temperature):

	lowerBound = float('inf')
	upperBound = -float('inf')

	for pref in temperature_preference:
		match pref:
			case "Hot":
				lowerBound = min(lowerBound, 80)
				upperBound = float('inf')
			case "Mild":
				lowerBound = min(lowerBound, 50)
				upperBound = max(upperBound, 80)
			case "Cold":
				lowerBound = -float('inf')
				upperBound = max(upperBound, 50)

	if lowerBound <= temperature <= upperBound:
		return 1.0

	return max(0, 1 - .05 * min(abs(temperature - lowerBound), abs(temperature - upperBound)))
		
def activityScore(country, activity_dictionary):

	activity_score = 0

	# aggregate sum of ALL priorities of activities inserted
	sum_activity_priorities = sum(activity_dictionary.values())
	
	# iterate through each activity and match the country to it
	for activity, score in activity_dictionary.items() :

		# if the activity exists in country we add (country activity score [0,1] * [priority score / total priority score])
		if activity in country["Activities"]:
			activity_score += country["Activities"][activity] * score / sum_activity_priorities

	return activity_score

def getIndvidiualCountryScore(country, weather_dictionary, activity_dictionary, start_month, end_month):
	
	# scores [0, 1] for how matching the country is to preference

	weather_of_country = country["Weather"]
	temperature = (weather_of_country[start_month] + weather_of_country[end_month]) / 2

	activity_score  = 1 if activity_dictionary == {} else activityScore(country, activity_dictionary)
	weather_score   = 1 if weather_dictionary == {} else weatherScore(weather_dictionary["Pref"], temperature)

	if not weather_dictionary:
		return activity_score

	if not activity_dictionary:
		return weather_score

	# scalar to balance out the scores such that sum of scores = 1
	weather_scalar  = (.5 + .1 * (weather_dictionary["Priority"] - 3))
	activity_scalar = (.5 - .1 * (weather_dictionary["Priority"] - 3))

	return activity_score * activity_scalar + weather_score * weather_scalar

# scores = score_countries_by_criteria({"pref": "mild", "priority": 1}, {
# 	"Adventure": 4,
# 	"Beach": 4,
# 	#"Cuisine": 2,
# 	#"Culture": 1,
# 	"Hike": 4,
# 	"Museums": 2,
# 	#"Night life": 1,
# 	"Sights": 3,
# 	#"Snow": 1,
# 	"Water": 4
# }, "2022-05-01T18:25:43.511Z", "2022-05-20T18:25:43.511Z")

# keys = scores.keys()
# for key in keys:
# 	print(f"{key}: {scores[key]}")

# print({k: v for k, v in sorted(scores.items(), key=lambda item: item[1], reverse=True)})

# TemperatureFilling()
