// routes/index.js
const express = require('express');
const router = express.Router();
const { importCSV, upsertData } = require('../database/import-csv');

router.post('/import-csv', async (req, res) => {
  try {
    const records = await importCSV();
    await upsertData(records);
    res.status(200).json({ message: 'CSV data imported successfully!', count: records.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to import CSV' });
  }
});

module.exports = router; 