const express = require('express');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

let invoices = []; // in-memory array

// Helper function để check validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all invoices
router.get('/', (req, res) => {
  res.json(invoices);
});

// GET invoice by ID
router.get('/:id', 
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  validate,
  (req, res) => {
    const invoice = invoices.find(i => i.id === parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  }
);

// CREATE new invoice
router.post('/',
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('date').optional().isISO8601().withMessage('Date must be in ISO8601 format'),
  validate,
  (req, res) => {
    const invoice = req.body;
    invoice.id = invoices.length + 1;
    invoices.push(invoice);
    res.status(201).json(invoice);
  }
);

// UPDATE invoice by ID
router.put('/:id',
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('date').optional().isISO8601().withMessage('Date must be in ISO8601 format'),
  validate,
  (req, res) => {
    const invoice = invoices.find(i => i.id === parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Cập nhật từng trường nếu có
    const { title, amount, date } = req.body;
    if (title) invoice.title = title;
    if (amount) invoice.amount = amount;
    if (date) invoice.date = date;

    res.json(invoice);
  }
);

// DELETE invoice by ID
router.delete('/:id', 
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  validate,
  (req, res) => {
    const index = invoices.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Invoice not found" });
    const deleted = invoices.splice(index, 1);
    res.json({ message: "Invoice deleted", invoice: deleted[0] });
  }
);

module.exports = router;
