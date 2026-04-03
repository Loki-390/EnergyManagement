const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
app.use(cors(
    {
  origin: "*", // Allows any website (including your Vercel app) to talk to this server
  methods: ["GET", "POST"]
}
));


app.use(express.json());

// --- UPDATED: Cloud MySQL Connection (Aiven) ---
const db = mysql.createConnection({
    host: 'mysql-34abcb77-energymanagement.d.aivencloud.com',
    port: 28128,
    user: 'avnadmin',
    password: 'AVNS_amL3e4HxiUDcC5xorbI', // <--- PASTE YOUR AIVEN PASSWORD HERE
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false // Required for Aiven
    }
});

db.connect((err) => {
    if (err) {
        console.error('Cloud MySQL Connection Error:', err);
    } else {
        console.log('Connected to Aiven Cloud Database!');
        
        // Auto-create table if it doesn't exist in the new cloud DB
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS energy_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                power_usage_kwh FLOAT NOT NULL
            );
        `;
        db.query(createTableQuery, (err) => {
            if (err) console.error("Error creating table:", err);
        });
    }
});

// 1. Prediction Route (GET) - UPDATED FOR LINUX/RENDER
app.get('/api/predict', (req, res) => {
    // On Render (Linux), we use 'python3'. Locally on Windows, you used the venv path.
    // 'python3' is the standard command on Render/Linux servers.
    const pythonCommand = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
    const scriptPath = '../ai_engine/predict.py'; 
    
    const pythonProcess = spawn(pythonCommand, [scriptPath]);
    
    let pythonData = "";
    pythonProcess.stdout.on('data', (data) => { pythonData += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { console.error(`Python Error: ${data}`); });

    pythonProcess.on('close', (code) => {
        try { 
            res.json(JSON.parse(pythonData)); 
        } 
        catch (e) { 
            res.status(500).json({ error: "AI Error", raw: pythonData }); 
        }
    });
});

// 2. Add New Data Route (POST)
app.post('/api/add-data', (req, res) => {
    const { usage } = req.body;
    const query = "INSERT INTO energy_logs (power_usage_kwh) VALUES (?)";
    db.query(query, [usage], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json({ message: "Data saved!" });
    });
});

// 3. History Route (GET)
app.get('/api/history', (req, res) => {
    const query = "SELECT id, DATE_FORMAT(timestamp, '%b %d, %H:%i') as date, power_usage_kwh as usage_val FROM energy_logs ORDER BY timestamp DESC LIMIT 10";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// 4. Stats Summary Route (GET)
app.get('/api/stats', (req, res) => {
    const query = `SELECT ROUND(AVG(power_usage_kwh), 2) as avg_usage, ROUND(SUM(power_usage_kwh), 2) as total_usage FROM energy_logs WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Stats error" });
        res.json(results[0] || { avg_usage: 0, total_usage: 0 });
    });
});

// 5. Appliance Decomposition Route (GET)
app.get('/api/appliances', (req, res) => {
    const query = "SELECT SUM(power_usage_kwh) as total FROM energy_logs WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Decomposition error" });
        const total = results[0].total || 0;
        const breakdown = [
            { name: 'Air Conditioning', value: parseFloat((total * 0.45).toFixed(2)), color: '#6366f1' },
            { name: 'Refrigerator', value: parseFloat((total * 0.18).toFixed(2)), color: '#10b981' },
            { name: 'Washing Machine', value: parseFloat((total * 0.12).toFixed(2)), color: '#ec4899' },
            { name: 'Lighting', value: parseFloat((total * 0.10).toFixed(2)), color: '#f59e0b' },
            { name: 'Other Appliances', value: parseFloat((total * 0.15).toFixed(2)), color: '#94a3b8' }
        ];
        res.json(breakdown);
    });
});

// --- UPDATED: Dynamic Port for Render ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`); 
});