import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from joblib import dump

# Load the data from CSV
data = pd.read_csv('random_entities1.csv')

# Prepare the data
X = data[['division', 'age']]  # Columns 'division' and 'age'
y = data['weight']  # Column 'weight'

# Preprocessing: One-hot encoding for 'division' column
preprocessor = ColumnTransformer(
    transformers=[('encoder', OneHotEncoder(), [0])],  # Column 0 (division) based on 0-indexing
    remainder='passthrough'
)

# Define the machine learning model
model = RandomForestRegressor()

# Create the pipeline
pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('model', model)])

# Train the model
print("Training started...")
pipeline.fit(X, y)
print("Training completed.")

# Export the trained model
dump(pipeline, 'bodybuilder_weight_model.joblib')
print("Model exported successfully.")
