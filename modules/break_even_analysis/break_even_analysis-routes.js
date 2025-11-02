const { Router } = require('express');

//import BEP model
const BEPModel = require('./models/break_even_analysis-model');
const createBepRules = require('./middlewares/create_bep_rules');
const updateBepRules = require('./middlewares/update_bep_rules');
const bepRoute = Router();

//get method
bepRoute.get("/", async(req, res) => {
    try {
        const allBep = await BEPModel.find();
        if(!allBep) res.json([]);
        else res.json(allBep);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Failed to get all BEP: ${err}`)
    }
});

//post method
bepRoute.post("/",createBepRules, async(req, res) => {
    try {
        const new_bep = await BEPModel.create({
            company_name: req.body.company_name,
            scenario_name: req.body.scenario_name,
            variable_cost_per_unit: req.body.variable_cost_per_unit,
            fixed_cost: req.body.fixed_cost,
            selling_price_per_unit: req.body.selling_price_per_unit,
            bep_unit: req.body.bep_unit
        })
        res.status(200).json(new_bep);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Failed to create  new bep ${err}`)
    }
});


// put method to update bep
bepRoute.put("/:id", updateBepRules, async(req, res) => {
    try {
        const id = req.params.id;
        const updated_bep = await BEPModel.findByIdAndUpdate(
            id, 
            {$set: req.body},
            {new: true, runValidators: true}
        );
        res.status(200).send(updated_bep);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Failed to update bep: ${err}`);
    }
});

// delete method
module.exports = bepRoute;