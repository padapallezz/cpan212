const express = require('express');
const router = express.Router();

let invoices = []; // in-memory

// Get all invoices
router.get('/', (req, res) => {
  res.json(invoices);
});

// Add invoice
router.post('/', (req, res) => {
  const invoice = req.body;
  invoice.id = invoices.length + 1;
  invoices.push(invoice);
  res.json(invoice);
});

// Get invoice by ID
router.get('/:id', (req, res) => {
  const invoice = invoices.find(i => i.id == req.params.id);
  if(!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
});

module.exports = router;
