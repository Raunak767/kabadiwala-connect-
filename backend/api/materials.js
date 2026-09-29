const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const filePath = path.join(__dirname, '..', 'datasets', 'materials.json');
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read materials dataset' });
  }
};
