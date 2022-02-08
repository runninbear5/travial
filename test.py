from inspect import getcallargs
from itertools import count
from api.firebase import Firebase
from amadeus import Client, ResponseError
import requests, json
# import util

db = Firebase()

# tmpData = {"Name": "Greenland",
# 			"Snow": 3,
# 			"Hike": 0,
# 			"Sights": 0,
# 			"Water": 0,
# 			"Cuisine": 0,
# 			"Adventure": 0,
# 			"Beach": 0,
# 			"Culture": 0,
# 			"Night life": 0,
# 			"Museums": 0
# 		}
# db.writeCountryData("Greenland", tmpData)

#print(db.getCountriesOnActivities("Hike"))

# amadeus = Client(
#     client_id= #TODO: AMADEUS API KEY
#     client_secret= #TODO: AMADEUS API SECRET KEY
# )

# try:
#     response = amadeus.shopping.flight_offers_search.get(
#         originLocationCode='FIH',
#         destinationLocationCode='HBE',
#         departureDate='2022-06-01',
#         adults=1)
#     print(response.data)
# except ResponseError as error:
#     print(error)
