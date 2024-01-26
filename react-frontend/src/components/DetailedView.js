import React, { useState } from 'react';

const DetailedView = ({ parsedData = [] }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isContextExpanded, setIsContextExpanded] = useState(false);

  const handleItemClick = (item) => {
    // When a new item is selected, we reset the context to not expanded
    setIsContextExpanded(false);
    setSelectedItem(item);
  };

  // Function to toggle the context expanded state
  const toggleContextExpanded = () => {
    setIsContextExpanded(!isContextExpanded);
  };

 // Function to display detailed information of an item
const renderDetailedInformation = (item) => {
    const context = isContextExpanded ? item.context : `${item.context.substring(0, 100)}...`;
  
    // Function to remove punctuation and convert to lowercase
    const sanitizeString = (str) => {
      return str.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    };
  
    // Split labelandllmgeneratedresponse into category and content
    const [category, ...contentArray] = item.labelandllmgeneratedresponse.split('\n');
    const content = contentArray.join(' ');
    const sanitizedContent = sanitizeString(content);
  
    // Sanitize expectedresponse for comparison
    const sanitizedExpectedResponse = sanitizeString(item.expectedresponse);
  
    // Split the original and sanitized responses into words
    const originalExpectedWords = item.expectedresponse.split(' ');
    const originalContentWords = content.split(' ');
    const expectedWords = sanitizedExpectedResponse.split(' ');
    const contentWords = sanitizedContent.split(' ');
  
    // Create sets for efficient lookups
    const expectedWordsSet = new Set(expectedWords);
    const contentWordsSet = new Set(contentWords);
  
    // Highlight matching words in content (using original form for display)
    const highlightedContent = originalContentWords.map((word, index) => {
      const sanitizedWord = sanitizeString(word);
      return expectedWordsSet.has(sanitizedWord) ? `<mark style="background-color:yellow;">${word}</mark>` : word;
    }).join(' ');
  
    // Highlight unique words in expected response (using original form for display)
    const highlightedExpectedResponse = originalExpectedWords.map((word, index) => {
      const sanitizedWord = sanitizeString(word);
      return !contentWordsSet.has(sanitizedWord) ? `<mark style="background-color:lightcoral;">${word}</mark>` : word;
    }).join(' ');
  
    return (
      <div>
        {Object.keys(item).map((key, index) => {
          // Special handling for context to make it expandable
          if (key === 'context') {
            return (
              <div key={index} onClick={toggleContextExpanded} style={{ cursor: 'pointer', color: 'blue', marginTop: '5px' }}>
                <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {context}
              </div>
            );
          } else if (key === 'labelandllmgeneratedresponse') {
            return (
              <li key={index}>
                <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> <u>{category.trim()}</u><br /><span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
              </li>
            );
          } else if (key === 'expectedresponse') {
            return (
              <li key={index}>
                <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> <span dangerouslySetInnerHTML={{ __html: highlightedExpectedResponse }} />
              </li>
            );
          }
  
          return (
            <li key={index}>
              <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {item[key]}
            </li>
          );
        })}
      </div>
    );
  };
  
  
  

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, marginRight: '10px', overflowY: 'auto', maxHeight: '80vh' }}>
        <h2>List of Queries</h2>
        {parsedData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item)}
            style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}
          >
            <strong>Query {index}: </strong>
            {item.query}
          </div>
        ))}
      </div>
      <div style={{ flex: 2, overflowY: 'auto', maxHeight: '80vh' }}>
        {selectedItem && (
          <div style={{ padding: '10px', border: '1px solid #000' }}>
            <h3>Details:</h3>
            <ul>{renderDetailedInformation(selectedItem)}</ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedView;