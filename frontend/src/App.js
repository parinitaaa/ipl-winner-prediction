import { useState } from "react";

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
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>🏏 IPL Win Predictor</h2>

      <form onSubmit={handleSubmit}>
        {[
          ["batting_team", "Batting Team"],
          ["bowling_team", "Bowling Team"],
          ["city", "City"],
          ["target", "Target"],
          ["runs_left", "Runs Left"],
          ["balls_left", "Balls Left"],
          ["wickets_left", "Wickets Left"]
        ].map(([name, label]) => (
          <div key={name} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2ecc71",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Predict
        </button>
      </form>

      {loading && <p>Predicting...</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>{result.prediction}</h3>
          <p>Win Probability: <b>{result.win_probability}%</b></p>
        </div>
      )}
    </div>
  );
}

export default App;
