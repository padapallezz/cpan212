const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());


const invoiceRoutes = require('./routes/invoiceRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/invoices', invoiceRoutes);
app.use('/expenses', expenseRoutes);
app.use('/forecasts', forecastRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to your BTracker!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
