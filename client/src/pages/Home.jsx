import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EnergyChart from '../components/EnergyChart';
import SmartAlert from '../components/SmartAlert';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RefreshCcw, Zap, PlusCircle, TableProperties, Activity, BarChart3, PieChart as PieIcon, LogOut } from 'lucide-react';

function Home() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ avg_usage: 0, total_usage: 0 });
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- UPDATED: Using your live Render URL ---
  const API_BASE_URL = 'https://energymanagement.onrender.com';

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [predRes, statsRes, appRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/predict`),
        axios.get(`${API_BASE_URL}/api/stats`),
        axios.get(`${API_BASE_URL}/api/appliances`)
      ]);
      setData(predRes.data);
      setStats(statsRes.data);
      setAppliances(appRes.data);
    } catch (err) { 
      console.error("Sync Error:", err); 
      // Optional: alert("Server is waking up... please wait 30 seconds and try again.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={28} fill="#4f46e5" color="#4f46e5" /> Energy AI Dashboard
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>AI-Driven Predictive Analytics & Load Decomposition</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/history')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', 
                backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', 
                borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' 
              }}
            >
              <TableProperties size={18} color="#1e293b" /> View Logs
            </button>

            <button 
              onClick={() => navigate('/add')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', 
                backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', 
                borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' 
              }}
            >
              <PlusCircle size={18} color="#1e293b" /> Add Entry
            </button>

            <button 
              onClick={fetchAllData} 
              disabled={loading} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', 
                cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#4f46e5', 
                color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
              }}
            >
              <RefreshCcw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? "Syncing..." : "Update System"}
            </button>

            <button 
              onClick={handleLogout} 
              title="Logout"
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', 
                backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', 
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' 
              }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <StatCard title="Avg Daily Load" value={`${stats.avg_usage || 0} kWh`} icon={<Activity color="#6366f1" />} color="#eef2ff" />
          <StatCard title="30-Day Total" value={`${stats.total_usage || 0} kWh`} icon={<BarChart3 color="#10b981" />} color="#ecfdf5" />
          <StatCard title="System Status" value="AI Optimized" icon={<Zap color="#f59e0b" />} color="#fffbeb" />
        </div>

        <SmartAlert data={data} loading={loading} />

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px' }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} /> 7-Day Prediction Forecast
            </h3>
            <EnergyChart data={data} loading={loading} />
          </div>

          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={18} /> Appliance Breakdown (Estimated)
            </h3>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appliances} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {appliances.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' }}>
    <div style={{ backgroundColor: color, padding: '12px', borderRadius: '12px' }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{title}</p>
      <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b', fontWeight: '800' }}>{value}</h2>
    </div>
  </div>
);

export default Home;