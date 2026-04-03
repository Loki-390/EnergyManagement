import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Zap } from 'lucide-react';

const AddData = () => {
  const [usage, setUsage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post('https://energymanagement.onrender.com/api/add-data', { usage: parseFloat(usage) });
      alert("Data synchronized with AI model!");
      navigate('/'); // Go back to dashboard to see results
    } catch (err) {
      console.error(err);
      alert("Synchronization failed. Ensure Node.js server is running.");
    }
    setIsSaving(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontWeight: '600' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
            <Zap size={30} color="#3b82f6" fill="#3b82f6" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0' }}>New Energy Entry</h2>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Log your current meter reading to update the AI forecast.</p>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Consumption (kWh)</label>
            <input 
              type="number" 
              step="0.01" 
              required 
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="0.00" 
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '18px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            style={{ width: '100%', padding: '16px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}
          >
            <Save size={20} />
            {isSaving ? "Syncing..." : "Save & Update AI"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddData;