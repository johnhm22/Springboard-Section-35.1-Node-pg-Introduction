const { Client } = require ("pg");
const dotenv = require('dotenv');

dotenv.config();


let DB_URI;

console.log("What is the NODE_ENV?", process.env.NODE_ENV);

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///biztime_test";
} else {
    DB_URI = "postgresql:///biztime";
}

console.log("Using URI", DB_URI);

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;