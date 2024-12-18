const db = require('../db');

const createWeatherSearchTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS weather_search (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      city VARCHAR(255),
      weather_info TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`;
  await db.query(sql);
};

createWeatherSearchTable();

module.exports = db;
