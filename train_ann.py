import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import ipaddress  

# Load datasets
train_df = pd.read_csv("/media/anubis/Working/Projects/DDOS SDN/DDOS-dataset/TRAIN-DATA.csv")
test_df = pd.read_csv("/media/anubis/Working/Projects/DDOS SDN/DDOS-dataset/TEST-DATA.csv")

# Convert IP addresses to numeric values
def ip_to_int(ip):
    return int(ipaddress.ip_address(ip))

train_df["src_ip"] = train_df["src_ip"].apply(ip_to_int)
train_df["dst_ip"] = train_df["dst_ip"].apply(ip_to_int)
test_df["src_ip"] = test_df["src_ip"].apply(ip_to_int)
test_df["dst_ip"] = test_df["dst_ip"].apply(ip_to_int)

# Separate features and target
X_train = train_df.drop(columns=["label"])
y_train = train_df["label"]
X_test = test_df.drop(columns=["label"])
y_test = test_df["label"]

# Encode target labels
label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(y_train)
y_test = label_encoder.transform(y_test)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Save scaler and label encoder
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

# Build ANN model
model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dense(len(np.unique(y_train)), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=20, batch_size=32, validation_data=(X_test, y_test))

# Save the trained model
model.save("ddos_ann_model.h5")

print("Model training complete and saved as ddos_ann_model.h5")
