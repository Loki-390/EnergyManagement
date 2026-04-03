const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // <--- CHANGE TO YOUR PASSWORD
    database: 'smart_energy'
});

db.connect();

console.log("Adding 100 days of energy data... Please wait.");

const entries = [];
for (let i = 100; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    
    // Generates random usage between 1.5 and 4.5 kWh
    const usage = (Math.random() * (4.5 - 1.5) + 1.5).toFixed(2);
    entries.push([formattedDate, usage]);
}

const query = "INSERT INTO energy_logs (timestamp, power_usage_kwh) VALUES ?";

db.query(query, [entries], (err, result) => {
    if (err) {
        console.error("Error seeding data:", err);
    } else {
        console.log(`Success! ${result.affectedRows} rows inserted.`);
    }
    db.end();
});