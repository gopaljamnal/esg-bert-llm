import React, { useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

function App() {
  const [url, setUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [chartData, setChartData] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);  // Tracks if classification is in progress

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsClassifying(true);  // Start processing, hide inputs
    try {
      const response = await axios.post('/classify', { url });
      const result = response.data.score;
      console.log(result);

      // Process the result for plotting
      const labels = Object.keys(result);
      const scores = labels.map(label => result[label]);

      setChartData({
        labels: labels,
        scores: scores,
      });

      setIsClassifying(false);  // Stop processing once data is ready

    } catch (error) {
      console.error("Error fetching data:", error.response || error.message || error);
      setIsClassifying(false);  // Stop processing on error
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>ESG Report Classification</h1>

      {!isClassifying && !chartData && (  // Show form only if not classifying and no chart yet
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <label style={{ fontSize: '18px' }}>
            Enter ESG Report URL (it may take a few minutes as BERT analyzes the document):
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.responsibilityreports.com/Click/2534"
              style={{
                marginLeft: '10px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '400px',
                marginBottom: '10px',
              }}
            />
          </label>
          <br />
          <label style={{ fontSize: '18px' }}>
            Enter Company Name:
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., McDonald's"
              style={{
                marginLeft: '10px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '250px',
                marginBottom: '20px',
              }}
            />
          </label>
          <br />
          <button
            type="submit"
            style={{
              padding: '5px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Classify
          </button>
        </form>
      )}

      {isClassifying && !chartData && (  // Show processing message only if classifying and no chart yet
        <p style={{ color: '#555' }}>Processing... Please wait.</p>
      )}

      {chartData && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Plot
            data={[
              {
                x: chartData.labels,
                y: chartData.scores,
                type: 'bar',
                marker: { color: '#FF6347' },
              },
            ]}
            layout={{
              title: {
                text: `${companyName || 'Company'} ESG Report Classification Scores`,
                font: { size: 24 },
              },
              xaxis: {
                title: { text: 'Labels', font: { size: 18 } },
                tickfont: { size: 10 },
                tickangle: -45,
                automargin: true,
              },
              yaxis: {
                title: { text: 'Score', font: { size: 18 } },
                tickfont: { size: 14 },
              },
              plot_bgcolor: '#f8f9fa',
              paper_bgcolor: '#fff',
              margin: { l: 50, r: 50, b: 120, t: 70 },
              width: 800,
              height: 500,
            }}
          />
        </div>
      )}

      <footer className="footer" style={{ marginTop: '30px', color: '#777' }}>
        <p>&copy; 2025 ESG Classification Tool. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
