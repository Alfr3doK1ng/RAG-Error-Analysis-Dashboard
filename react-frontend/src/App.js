import React, { useState } from 'react';
import Papa from 'papaparse';

import logo from './logo.svg';
import './App.css';

import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import DataOverview from './components/DataOverview';
// import ErrorAnalysis from './components/ErrorAnalysis';
import EmbeddingsVisualization from './components/EmbeddingsVisualization';
import DetailedView from './components/DetailedView';

function App() {

  const [parsedData, setParsedData] = useState([]); // State for the parsed data

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      parseCsvData(text); // Function to parse the CSV data
    };

    reader.readAsText(file);
  };

  // Function to parse CSV data using PapaParse
  const parseCsvData = (text) => {
    // Parse CSV data with PapaParse
    Papa.parse(text, {
      header: false, // Set to false because we'll process headers manually
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (rows.length < 3) {
          // Not enough data
          return;
        }
  
        // Extract the headers from the second row
        const headers = rows[1].map(header => header.trim().toLowerCase().replace(/\s+/g, ''));
        // Slice the csvData from the 3rd row onward to skip the title and header
        const data = rows.slice(2).map(row => {
          let rowData = {};
          row.forEach((cell, index) => {
            rowData[headers[index]] = cell;
          });
          return rowData;
        });
  
        setParsedData(data); // Set the state with the new array of objects
        console.log(data); // Log the transformed data
      }
    });
  };
  

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Sidebar onFileUpload={handleFileUpload} />
        <main>
          <DataOverview csvData={parsedData} />
          {/* <ErrorAnalysis /> */}      
          {parsedData && <EmbeddingsVisualization parsedData={parsedData}/>}    
          {parsedData && <DetailedView parsedData={parsedData} />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
