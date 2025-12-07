const { Router } = require('express');

//import BEP model
const BEPModel = require('./models/break_even_analysis-model');
const createBepRules = require('./middlewares/create_bep_rules');
const updateBepRules = require('./middlewares/update_bep_rules');
const bepRoute = Router();

//GET METHOD
bepRoute.get("/", async(req, res) => {
    try {
        const query = {};
        //Text filtering on company_name 
        // exact match, case-insensitive
        if(req.query.company_name) {
            query.company_name = { $regex: `^${req.query.company_name}$`, $options: "i"};
        // parital match, case-insensitive
        } else if(req.query.company_name_like) {
            query.company_name = { $regex: req.query.company_name_like, $options: "i"};
        }
        // Text filtering on scenario_name
        // exact match, case-insensitive
        if(req.query.scenario_name) {
            query.scenario_name = {$regex: `^${req.query.scenario_name}$`, $options: "i"};
        // partial match
        } else if (req.query.scenario_name_like) {
            query.scenario_name = { $regex: req.query.scenario_name_like, $options: "i"}
        }

        // NUMERIC FILTERING
        const numeric_fields = ['variable_cost_per_unit', 'fixed_cost', 'selling_price_per_unit', 'bep_unit'];
        numeric_fields.forEach(field => {
            const min = req.query[`${field}_min`];
            const max = req.query[`${field}_max`];
            if (min || max) {
                query[field] = {};
                if (min) query[field].$gte = Number(min);
                if (max) query[field].$lte = Number(max);
            }
        })
        console.log(query);

        // DATE FILTERING
        if (req.query.createdBefore || req.query.createdAfter) {
            query.createdAt = {};
            if (query.createdBefore) query.createdAt.$lte = new Date(req.query.createdBefore);
            if (query.createdAfter) query.createdAt.$gte = new Date(req.query.createdAfter);
        }

        // PAGINATION 
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Execute query
        const beps = await BEPModel.find(query)
            .skip(skip)
            .limit(limit);

        res.status(200).json(beps);

    } catch (err) {
        console.error(err);
        res.status(500).send(`Failed to get BEP: ${err}`)
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
        res.status(200).json(updated_bep);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Failed to update bep: ${err}`);
    }
});

// delete method
bepRoute.delete("/:id", async(req, res) => {
    try {
        const deleted_bep = await BEPModel.findByIdAndDelete(req.params.id);
        if(!deleted_bep) return res.status(500).send('BEP not found');
        res.status(200).json(deleted_bep);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(`Failed to delete BEP: ${err}`);
    }
})
module.exports = bepRoute;