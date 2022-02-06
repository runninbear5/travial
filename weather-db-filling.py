import requests, json
from api.firebase import Firebase
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.openweathermap.org/data/2.5/weather?"

URL = BASE_URL + "q=" + CITY + "&appid=" + API_KEY
