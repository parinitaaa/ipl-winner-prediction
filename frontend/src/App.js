import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    batting_team: "",
    bowling_team: "",
    city: "",
    target: "",
    runs_left: "",
    balls_left: "",
    wickets_left: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🏏 IPL Win Predictor</h2>
        <p className="subtitle">
          Enter the current match situation
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid">
            {[
              ["batting_team", "Batting Team"],
              ["bowling_team", "Bowling Team"],
              ["city", "City"],
              ["target", "Target"],
              ["runs_left", "Runs Left"],
              ["balls_left", "Balls Left"],
              ["wickets_left", "Wickets Left"]
            ].map(([name, label]) => (
              <div className="input-group" key={name}>
                <label>{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn">
            Predict Outcome
          </button>
        </form>

        {loading && <p className="loading">Predicting...</p>}

        {result && (
          <div className="result">
            <h3>{result.prediction}</h3>
            <p>
              Win Probability: <span>{result.win_probability}%</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
