import React from 'react';

const SmartAlert = ({ data, loading }) => {
  if (loading || !data.some(d => d.yhat > 3.0)) return null;

  return (
    <div style={{ 
      backgroundColor: '#fff3cd', 
      color: '#856404', 
      padding: '15px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      border: '1px solid #ffeeba'
    }}>
      <strong>⚠️ Smart Advice:</strong> High energy usage predicted for the upcoming days. Consider optimizing your appliance usage.
    </div>
  );
};

export default SmartAlert;