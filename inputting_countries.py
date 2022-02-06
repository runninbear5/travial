# Inputting Country Data

from logging import captureWarnings
from api.firebase import Firebase

db = Firebase()

cunt = True
while (cunt != "stop"):
	name            = input("name: ")
	snow_score      = int(input("snow: "))
	hike_score      = int(input("hike: "))
	sight_score     = int(input("sight: "))
	water_score     = int(input("water: "))
	adventure_score = int(input("adventure: "))
	cuisine_score   = int(input("cuisine: "))
	beach_score     = int(input("beach: "))
	culture_score   = int(input("culture: "))
	night_score     = int(input("night life: "))
	museum_score    = int(input("museum: "))
	capital    = "x"
	cunt = input("if stop t nmjype stop")

	data = {
		"Name": name,
		"Snow": snow_score/3.0,
		"Hike": hike_score/3.0,
		"Sights": hike_score/3.0,
		"Water": hike_score/3.0,
		"Cuisine": cuisine_score/3.0,
		"Adventure": adventure_score/3.0,
		"Beach": beach_score/3.0,
		"Culture": culture_score/3.0,
		"Night life": night_score/3.0,
		"Museums": museum_score/3.0,
		"Capital": capital
	}

	db.writeCountryData(name, data)
