from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import ipaddress


# Load trained model and preprocessing tools
model = tf.keras.models.load_model("/media/anubis/Working/Projects/DDOS SDN/models/ddos_ann_model.h5")
scaler = joblib.load("/media/anubis/Working/Projects/DDOS SDN/models/scaler.pkl")
label_encoder = joblib.load("/media/anubis/Working/Projects/DDOS SDN/models/label_encoder.pkl")

def ip_to_int(ip):
    return int(ipaddress.ip_address(ip))



app = Flask(__name__)
CORS(app)  
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400
      
   
    
    print(f"✅ Received file: {file.filename}") 
    
    
    df = pd.read_csv(file)

    # Convert IP addresses to numeric values
    df["src_ip"] = df["src_ip"].apply(ip_to_int)
    df["dst_ip"] = df["dst_ip"].apply(ip_to_int)

    df = scaler.transform(df)
    predictions = model.predict(df)
    predicted_labels = label_encoder.inverse_transform(np.argmax(predictions, axis=1))
    
    return jsonify({"predictions": predicted_labels.tolist()})

if __name__ == "__main__":
    app.run(debug=True)
