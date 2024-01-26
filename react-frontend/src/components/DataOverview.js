import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DataOverview = ({ csvData }) => {
  const [processedData, setProcessedData] = useState(null);

  // Process the data: Count occurrences for each category
  const processData = (csvData) => {
    const stats = {
      overall: { "correct": 0, "partially correct": 0, "incorrect": 0, "no answer": 0 },
      directQuestion: { "correct": 0, "partially correct": 0, "incorrect": 0, "no answer": 0 },
      indirectQuestion: { "correct": 0, "partially correct": 0, "incorrect": 0, "no answer": 0 },
    };

    csvData.forEach((item) => {
      // Determine the category from 'CATEGORY' field
      const category = item.category.includes('Direct') ? 'directQuestion' : 'indirectQuestion';

      // Increment the respective counter based on the label from 'Label and LLM generated response' field
      // Convert the label to a format that matches the keys in stats (e.g., 'partially correct' to 'partiallyCorrect')
      const label = item.labelandllmgeneratedresponse.split('\n')[0].toLowerCase();
      if (stats[category].hasOwnProperty(label)) {
        stats[category][label]++;
        stats.overall[label]++;
      }
    });

    return stats;
  };

  useEffect(() => {
    if (csvData && csvData.length) {
      const newData = processData(csvData);
      setProcessedData(newData);
    }
  }, [csvData]);

  const transformDataForChart = (processedData) => {
    if (!processedData) return [];

    // Transform the data into a format suitable for the bar chart
    return Object.entries(processedData).map(([category, counts]) => ({
      name: category, // 'overall', 'directQuestion', 'indirectQuestion'
      ...counts,
    }));
  };

  return (
    <div>
      <h2>Response Category Statistics</h2>
      {processedData ? (
        <BarChart width={600} height={300} data={transformDataForChart(processedData)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="correct" fill="#82ca9d" />
          <Bar dataKey="partially correct" fill="#8884d8" />
          <Bar dataKey="incorrect" fill="#ffc658" />
          <Bar dataKey="no answer" fill="#ff8042" />
        </BarChart>
      ) : (
        <p>No data to display. Please upload a CSV file.</p>
      )}
    </div>
  );
};

export default DataOverview;