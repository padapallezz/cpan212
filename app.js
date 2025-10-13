const express = require('express');
const app = express();
const port = 3000;

//application-level middlewares
//parse request body
app.use(express.json()); //parse JSON
app.use(express.urlencoded({ extended: true }))

//hanlde 404 not found routes
app.use((req, res) => {
  res.status(404).json({message: "Route not found"});
})

//Global error handler, log the error for debugging
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Something went wrong on the server."})
})



const invoiceRoutes = require('./routes/invoiceRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./modules/user/user-routes');
const revenueRoutes = require('./modules/revenue/revenue-routes');
const whatIfRoutes = require('./modules/what_if/what-if-routes');


app.use('/invoices', invoiceRoutes);
app.use('/expenses', expenseRoutes);
app.use('/forecasts', forecastRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/revenues', revenueRoutes);
app.use('/whatif', whatIfRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to your BTracker!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
