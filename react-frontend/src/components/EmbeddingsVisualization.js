import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const EmbeddingVisualization = ({ parsedData }) => {
  const [inputEmbedding, setInputEmbedding] = useState(null);
  const [outputEmbedding, setOutputEmbedding] = useState(null);

  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:8080/get-embeddings', { parsedData: parsedData }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response);
      setInputEmbedding(response.data.query_2d);
      setOutputEmbedding(response.data.answer_2d);
      setInput(response.data.query);
      setOutput(response.data.answer);
    })
    .catch(error => {
      console.error('Error fetching embeddings:', error);
    });
  }, [parsedData]); // Only re-run the effect if parsedData changes

  const formatDataForPlotly = (embeddingData, textData) => {
    // Create the trace for the scatter plot
    const trace = {
      x: embeddingData.map(v => v[0]), // x coordinates
      y: embeddingData.map(v => v[1]), // y coordinates
      text: textData, // Text data to display on hover
      type: 'scatter',
      mode: 'markers', // Display only markers, text is handled by annotations
      marker: { size: 6 },
      hoverinfo: 'text' // Display only the text on hover
    };
  
    // Create annotations for displaying indices
    const annotations = embeddingData.map((point, index) => {
      return {
        x: point[0],
        y: point[1],
        text: String(index), // Display index
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: {
          family: 'Arial',
          size: 12,
          color: 'black'
        }
      };
    });
  
    return { trace, annotations };
  };
  
  
  

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <div> {/* Container for Input Embedding */}
        <h4>Input Embedding</h4>
        {inputEmbedding ? (
          <Plot
            data={[formatDataForPlotly(inputEmbedding, input).trace]}
            layout={{
              width: 720,
              height: 440,
              title: 'Input Embedding Visualization',
              annotations: formatDataForPlotly(inputEmbedding, input).annotations
            }}
          />
        ) : (
          <p>No plot to display. Please upload a CSV file.</p>
        )}
      </div>
      
      <div> {/* Container for Output Embedding */}
        <h4>Output Embedding</h4>
        {outputEmbedding ? (
          <Plot
            data={[formatDataForPlotly(outputEmbedding, output).trace]}
            layout={{
              width: 720,
              height: 440,
              title: 'Output Embedding Visualization',
              annotations: formatDataForPlotly(outputEmbedding, output).annotations
            }}
          />
        ) : (
          <p>No plot to display. Please upload a CSV file.</p>
        )}
      </div>
    </div>
  );
  
};

export default EmbeddingVisualization;
