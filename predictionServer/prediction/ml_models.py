import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

def calculate_bestseller_threshold(sales_data):
    """Calculate Q3 threshold for bestseller classification"""
    q3 = np.percentile(sales_data['salequantity'], 75)
    return q3

def prepare_training_data(sales_data, time_col='month'):
    """Prepare data for model training"""
    # Calculate Q3 threshold
    q3_threshold = calculate_bestseller_threshold(sales_data)
    
    # Add bestseller label
    sales_data['bestseller'] = (sales_data['salequantity'] >= q3_threshold).astype(int)
    
    # Prepare features
    X = sales_data[['year', time_col, 'productfiltervalueid', 'salequantity']]
    y = sales_data['bestseller']
    
    return X, y, q3_threshold

def train_bestseller_model(sales_data, model_filename='bestseller_model.joblib', time_col='month'):
    """Train Random Forest model for bestseller prediction"""
    X, y, q3_threshold = prepare_training_data(sales_data, time_col=time_col)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=40, 
        max_depth=1,
        min_samples_leaf=1,
        criterion='entropy',
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train, y_train)
    
    # Calculate accuracy
    train_accuracy = model.score(X_train, y_train)
    test_accuracy = model.score(X_test, y_test)
    
    # Save model
    model_dir = 'prediction/models'
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, model_filename)
    joblib.dump(model, model_path)
    
    return {
        'train_accuracy': train_accuracy,
        'test_accuracy': test_accuracy,
        'q3_threshold': q3_threshold,
        'model_file': model_path
    }

def predict_bestseller(features, model_path=None):
    """Predict if a product is a bestseller"""
    if model_path is None:
        model_path = 'prediction/models/bestseller_model.joblib'
    
    if not os.path.exists(model_path):
        raise FileNotFoundError("Model file not found. Please train the model first.")
    
    model = joblib.load(model_path)
    
    # Ensure features have all required columns
    if 'quarter' in model_path:
        required_columns = ['year', 'quarter', 'productfiltervalueid', 'salequantity']
    else:
        required_columns = ['year', 'month', 'productfiltervalueid', 'salequantity']
    for col in required_columns:
        if col not in features.columns:
            raise ValueError(f"Missing required feature: {col}")
    
    # Make prediction
    prediction = model.predict(features)
    probability = model.predict_proba(features)
    
    return {
        'bestseller': int(prediction[0]),
        'probability': float(probability[0][1])
    } 