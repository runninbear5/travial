import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

class Firebase:

	def __init__(self):
		cred = credentials.Certificate('serviceAccount.json')
		firebase_admin.initialize_app(cred, {
			'databaseURL': 'https://travial-340401-default-rtdb.firebaseio.com/'
		})
		self.db = db
		self.ref = db.reference('')
		self.countries = self.ref.child('Countries')
	# Use a service account

	def writeCountryData(self, name, data):
		self.countries.child(name).set(data)

	def readCountryData(self, name):
		return self.countries.child(name).get()

	def getCountries(self):
		return self.countries.get().keys()

	def getActivities(self, country):
		return self.countries.child(country).child("Activities").get()

	def deleteCountry(self, name):
		self.countries.child(name).delete()

	def pushActivitiesData(self, activity, conutryList):
		self.ref.child("Activities").child(activity).set(conutryList)

	def getCountriesOnActivities(self, activity):
		return self.db.reference("Activities").child(activity).order_by_child("score").get()

	def writeAiportInfo(self, country, data):
		self.countries.child(country).child("Airports").set(data)

	def writeWeatherInfo(self, country, data):
		self.countries.child(country).child("Weather").set(data)

	def readWeather(self, country):
		return self.countries.child(country).child("Weather")

	def getAllActivities(self):
		return self.ref.child("Activities").order_by_key().get()
