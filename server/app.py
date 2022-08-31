from statistics import mode
from flask import Flask, jsonify, request
import pickle
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
import numpy as np

app = Flask(__name__)
CORS(app)
 
# api route for predicting diabetes
@app.route('/predict', methods = ["POST"])
def predict():
    # data from user
    data = request.json
    data = list(data.values())
    data = np.reshape(data, (1, -1)) # reshaping

    # scaling data
    scaler_file = open('scaler.pickle', 'rb')
    scaler = pickle.load(scaler_file)
    data = scaler.transform(data)

    # predicting
    model_file = open('model.pickle', 'rb')
    model = pickle.load(model_file)
    result = model.predict(data)
    
    return jsonify({"diabetic": True if result[0] else False})

 
if __name__ == '__main__':
    app.run(debug=True)