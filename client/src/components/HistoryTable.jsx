import React from 'react';
import { History, ArrowDownRight } from 'lucide-react';

const HistoryTable = ({ history }) => {
  return (
    <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <History size={20} color="#64748b" />
        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Recent Consumption Logs</h3>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
            <th style={{ padding: '12px', color: '#64748b', fontSize: '14px' }}>Date & Time</th>
            <th style={{ padding: '12px', color: '#64748b', fontSize: '14px' }}>Reading (kWh)</th>
            <th style={{ padding: '12px', color: '#64748b', fontSize: '14px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontSize: '14px', color: '#334155' }}>{row.date}</td>
              <td style={{ padding: '12px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{row.usage_val} kWh</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                  Synced
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;