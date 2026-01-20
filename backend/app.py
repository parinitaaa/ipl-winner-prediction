from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

model = joblib.load('model/ipl_win_predictor.pkl')

def prepare_input(df):
    df = df.copy()
    df['required_run_rate'] = (df['runs_left'] * 6) / df['balls_left']
    df['current_run_rate'] = ((df['target'] - df['runs_left']) * 6) / (120 - df['balls_left'])
    return df

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    #input fromt he user
    df = pd.DataFrame([{
        'batting_team': data['batting_team'],
        'bowling_team': data['bowling_team'],
        'city': data['city'],
        'target': int(data['target']),
        'runs_left': int(data['runs_left']),
        'balls_left': int(data['balls_left']),
        'wickets_left': int(data['wickets_left'])
    }])

    df = prepare_input(df)

    prediction = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])
    batting_team = data['batting_team']
    bowling_team = data['bowling_team']

    if prediction == 1:
     message = f"{batting_team} will WIN 🏆"
    else:
     message = f"{bowling_team} will WIN 🏆"

    return jsonify({
        'prediction': prediction,
        'win_probability': round(probability * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
