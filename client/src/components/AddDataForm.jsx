import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';

const AddDataForm = ({ onDataAdded }) => {
  const [usage, setUsage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post('http://localhost:5000/api/add-data', { usage: parseFloat(usage) });
      setUsage('');
      // Tell Home.jsx to refresh the predictions
      onDataAdded(); 
      alert("New reading saved! AI will now update the forecast.");
    } catch (err) {
      alert("Failed to save data. Check backend connection.");
    }
    setIsSaving(false);
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: '24px', 
      borderRadius: '20px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginBottom: '30px',
      border: '1px solid #f1f5f9'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
            Current Meter Reading (kWh)
          </label>
          <input 
            type="number" 
            step="0.01"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            placeholder="Enter usage value..."
            required
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: '10px', 
              border: '2px solid #e2e8f0',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#0f172a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            height: '48px'
          }}
        >
          <PlusCircle size={18} />
          {isSaving ? "Saving..." : "Add Reading"}
        </button>
      </form>
    </div>
  );
};

export default AddDataForm;