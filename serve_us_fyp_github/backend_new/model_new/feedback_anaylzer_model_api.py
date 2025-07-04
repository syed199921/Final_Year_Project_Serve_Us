import pickle

from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.python.keras import activations
from transformers import TFDistilBertForSequenceClassification, DistilBertTokenizer
import numpy as np
import json


def construct_encodings(x, tokenizer, max_len, trucation=True, padding=True):
  return tokenizer(x, max_length=max_len, truncation=trucation, padding=padding)

def construct_tfdataset(encodings, y=None):
    if y:
      return tf.data.Dataset.from_tensor_slices((dict(encodings), y))
    else:
      # this case is used when making predictions on unseen samples after training
      return tf.data.Dataset.from_tensor_slices(dict(encodings))

def create_predictor(model, model_name, max_len):
  tokenizer = DistilBertTokenizer.from_pretrained(model_name)
  def predict_proba(text):
      x = [text]

      encodings = construct_encodings(x, tokenizer, max_len=max_len)
      tfdataset = construct_tfdataset(encodings)
      tfdataset = tfdataset.batch(1)

      preds = model.predict(tfdataset).logits
      preds = activations.softmax(tf.convert_to_tensor(preds)).numpy()
      return preds[0][1]

  return predict_proba
app = Flask(__name__)
CORS(app)
new_model = TFDistilBertForSequenceClassification.from_pretrained('C:/Users/syedz/Contents/Academia/Serve-Us/Serve-Us_FYP/backend/model/sentiment_analyzer_model-20250321T061745Z-001/sentiment_analyzer_model')
model_name, max_len = pickle.load(open('C:/Users/syedz/Contents/Academia/Serve-Us/Serve-Us_FYP/backend/model/sentiment_analyzer_model-20250321T061745Z-001/sentiment_analyzer_model/info.pkl', 'rb'))
model = create_predictor(new_model, model_name,max_len)
@app.route('/api/predict', methods=['POST'])
def predict():
  data = request.get_json()
  results = []
  for item in data:
      good_reviews = 0
      technician_rating = 0
      total_reviews = len(item["reviews"])
      total_ratings = len(item["reviews"]) * 10
      for review in item["reviews"]:
          technician_rating += review["rating"]
          predict_prob = model(review["review"])
          if predict_prob > 0.7:
            good_reviews = good_reviews + 1
      results.append({"technician": item["user"]["userId"], "good_reviews": good_reviews, "total_reviews": total_reviews, "total_ratings": total_ratings, "technician_rating": technician_rating})

  return jsonify(results)

if __name__ == '__main__':
  app.run(debug=True)