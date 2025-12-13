const mongoose = require('mongoose');

const WhatIfSchema = new mongoose.Schema({
  scenario_name: { type: String, required: true, minLength: 3 },
  base_product: { type: String, required: true, minLength: 1 },
  old_price: { type: Number, required: true, min: 0 },
  new_price: { type: Number, required: true, min: 0 },
  fixed_cost: { type: Number, required: true, min: 0 },
  variable_cost: { type: Number, required: true, min: 0 },
  units_sold: { type: Number, required: true, min: 0 },
  expected_profit: { type: Number, required: true },

  // Link to the user who created this scenario
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const WhatIfModel = mongoose.model("WhatIf", WhatIfSchema);
module.exports = WhatIfModel;

