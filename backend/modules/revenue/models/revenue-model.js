const { mongoose } = require('mongoose');

// Subdocument for each product
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 1 },
  units_sold: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  variable_cost: { type: Number, required: true, min: 0 } // needed to calculate profit
});

// Main schema for company revenue
const RevenueSchema = new mongoose.Schema({
  company: { type: String, required: true, minLength: 3 },
  invoice: { type: Number, required: true, min: 0 },           
  revenue: { type: Number, required: true, min: 0 },           
  variable_cost: { type: Number, required: true, min: 0 },     
  fixed_cost: { type: Number, default: 0, min: 0 },            
  profit: { type: Number, required: true, min: 0 },            
  products: { type: [ProductSchema], required: true }          
}, { timestamps: true });                                        

// Create the model
const RevenueModel = mongoose.model("Revenue", RevenueSchema);

module.exports = RevenueModel;
