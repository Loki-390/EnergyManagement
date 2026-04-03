import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HistoryTable from '../components/HistoryTable';
import { ArrowLeft, Database, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Updated import

const HistoryLogs = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://energymanagement.onrender.com/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Header Design
      doc.setFillColor(79, 70, 229); 
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('Energy Analytics Report', 14, 25);
      
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 33);

      const totalUsage = history.reduce((sum, item) => sum + parseFloat(item.usage_val), 0).toFixed(2);
      
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.text(`Summary: Total Consumption (Last 10 Logs) = ${totalUsage} kWh`, 14, 50);

      // Table Generation - Using the autoTable function directly
      const tableColumn = ["Date & Time", "Reading (kWh)", "Status"];
      const tableRows = history.map(log => [
        log.date,
        `${log.usage_val} kWh`,
        "Verified"
      ]);

      // FIX: Calling autoTable as a standalone function
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], halign: 'center' },
        columnStyles: {
          1: { halign: 'center', fontStyle: 'bold' },
          2: { halign: 'center' }
        }
      });

      doc.save('Energy_Consumption_History.pdf');
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <button 
              onClick={() => navigate('/')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '12px', fontWeight: '600' }}
            >
              <ArrowLeft size={18} /> Back to Forecast
            </button>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={28} color="#4f46e5" /> Historical Logs
            </h1>
          </div>

          <button 
            onClick={downloadPDF} 
            disabled={loading || history.length === 0}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
              backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', 
              borderRadius: '12px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', transition: 'all 0.2s'
            }}
          >
            <FileDown size={18} /> 
            {loading ? "Syncing..." : "Download PDF"}
          </button>
        </header>

        <HistoryTable history={history} />
      </div>
    </div>
  );
};

export default HistoryLogs;