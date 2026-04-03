import mysql.connector
import pandas as pd
from prophet import Prophet
import json
import sys
import warnings

# Disable unnecessary logging for a cleaner output
warnings.filterwarnings("ignore")

def run_forecast():
    try:
        # 1. Connect to MySQL
        # Make sure to use your actual MySQL root password here
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="password", 
            database="smart_energy"
        )

        # 2. Fetch historical data from MySQL
        # 'ds' and 'y' are required column names for the Prophet library
        query = "SELECT timestamp as ds, power_usage_kwh as y FROM energy_logs"
        df = pd.read_sql(query, db)

        if df.empty:
            return json.dumps({"error": "No data found in energy_logs table."})

        # 3. Setup and Train the AI Model
        # interval_width=0.95 creates a 95% confidence interval for predictions
        model = Prophet(interval_width=0.95)
        model.fit(df)

        # 4. Create future timestamps for the next 7 days
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        # 5. Prepare the data for our React frontend
        # We only need the date (ds) and the predicted value (yhat)
        result = forecast[['ds', 'yhat']].tail(7).to_dict(orient='records')
        
        # Format the dates so they look nice in JavaScript
        for row in result:
            row['ds'] = row['ds'].strftime('%Y-%m-%d')
            row['yhat'] = round(row['yhat'], 2) # Round to 2 decimal places

        return json.dumps(result)

    except Exception as e:
        return json.dumps({"error": str(e)})
    finally:
        if 'db' in locals() and db.is_connected():
            db.close()

if __name__ == "__main__":
    # This prints the JSON result so Node.js can capture it
    print(run_forecast())