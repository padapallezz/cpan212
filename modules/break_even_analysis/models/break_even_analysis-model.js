const mongoose = require('mongoose');

const BEPSchema = new mongoose.Schema({
    company_name: {type:String, required: true, minlength: 3},
    scenario_name: {type: String, required: true, minlength: 10},
    variable_cost_per_unit: {type: Number, required: true, min: 0},
    fixed_cost: {type: Number, required: true, min: 0},
    selling_price_per_unit: {type: Number, required: true, min: 0},
    bep_unit: {type: Number, required: true, min: 0},
}, {timestamps: true});

const BEPModel = mongoose.model("Bep", BEPSchema);
module.exports = BEPModel;