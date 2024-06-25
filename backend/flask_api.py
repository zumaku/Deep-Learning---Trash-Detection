from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
import base64

import logging

app = Flask(__name__)
CORS(app)

# Load model
model = YOLO('../model/best.pt')  # Ganti dengan path model Anda

def read_imagefile(file) -> np.ndarray:
    image = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    image = read_imagefile(file)
    
    # Perform prediction
    results = model(image)
    result_image = results[0].plot()
    
    # Encode image to base64 string
    _, buffer = cv2.imencode('.jpg', result_image)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({'result': jpg_as_text})

@app.route('/')
def index():
    app.logger.info('API is running')
    return 'YOLOv5 Object Detection API'

@app.after_request
def after_request(response):
    app.logger.info(f'{request.method} {request.path} - {response.status}')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

