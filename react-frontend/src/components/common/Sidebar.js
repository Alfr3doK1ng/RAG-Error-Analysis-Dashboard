import React, { useState } from 'react';

const Sidebar = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    // Get the file from the input field
    const file = event.target.files[0];
    setSelectedFile(file); // Set the selected file in state
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit action
    if (selectedFile) {
      onFileUpload(selectedFile); // Call the onFileUpload function with the selected file
      setSelectedFile(null); // Reset the selected file
    }
  };

  return (
    <div className="sidebar">
      <h2>Upload your CSV file</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Sidebar;
