import requests

url = "http://127.0.0.1:5000/predict"
files = {"file": open("/media/anubis/Working/Projects/DDOS SDN/DDOS-dataset/Test.csv", "rb")}
response = requests.post(url, files=files)

print(response.json())
