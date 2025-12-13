const { Router } = require('express');

// Import BEP model and validation rules
const BEPModel = require('./models/break_even_analysis-model');
const createBepRules = require('./middlewares/create_bep_rules');
const updateBepRules = require('./middlewares/update_bep_rules');
const authorize = require('../../shared/middlewares/authorize'); // our RBAC middleware
const bepRoute = Router();

// Admin can view all BEPs
bepRoute.get("/", authorize(["admin","customer"]), async (req, res) => {
    try {
        let query = {};

        // Restrict customer to only their BEPs
        if (!req.account.roles.includes("admin")) {
            query.createdBy = req.account.id || req.account._id;
        }

        // Text filters
        if (req.query.product_name) {
            query.product_name = { $regex: `^${req.query.product_name}$`, $options: "i" };
        } else if (req.query.product_name_like) {
            query.product_name = { $regex: req.query.product_name_like, $options: "i" };
        }

        // Numeric filters
        const numeric_fields = ['variable_cost_per_unit', 'fixed_cost', 'selling_price_per_unit', 'bep_unit'];
        numeric_fields.forEach(field => {
            const min = req.query[`${field}_min`];
            const max = req.query[`${field}_max`];
            if (min || max) {
                query[field] = {};
                if (min) query[field].$gte = Number(min);
                if (max) query[field].$lte = Number(max);
            }
        });

        // Date filters
        if (req.query.createdBefore || req.query.createdAfter) {
            query.createdAt = {};
            if (req.query.createdBefore) query.createdAt.$lte = new Date(req.query.createdBefore);
            if (req.query.createdAfter) query.createdAt.$gte = new Date(req.query.createdAfter);
        }

        // Pagination
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const beps = await BEPModel.find(query).skip(skip).limit(limit);
        res.status(200).json(beps);

    } catch (err) {
        console.error(err);
        res.status(500).send(`Failed to get BEPs: ${err}`);
    }
});


// Admin can access any BEP
// Customer can only access their own BEP
bepRoute.get(
    '/:id',
    authorize(["admin","customer"]), 
    async (req, res) => {
        const { id } = req.params;
        try {
            const bep = await BEPModel.findById(id);
            if (!bep) return res.status(404).json({ message: "BEP scenario not found" });

            const isAdmin = req.account.roles.includes("admin");

            if (!isAdmin && bep.createdBy.toString() !== req.account._id) {
                return res.status(403).json({ message: "Forbidden: cannot access other's BEP" });
            }

            res.status(200).json(bep);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch BEP scenario", error: err.message });
        }
    }
);


// ==================== CREATE new BEP ====================
// Only authenticated users can create a BEP
bepRoute.post(
    "/", 
    authorize(["admin","customer"]), // anyone logged in
    createBepRules, 
    async (req, res) => {
        try {
            
            
            console.log("Account info:", req.account);
            const { product_name, variable_cost_per_unit, fixed_cost, selling_price_per_unit } = req.body;

            // Validate business logic
            if (selling_price_per_unit <= variable_cost_per_unit) {
                return res.status(400).json({ message: "Selling price per unit must be greater than variable cost per unit." });
            }

            const bep_unit = fixed_cost / (selling_price_per_unit - variable_cost_per_unit);

            // Save BEP with creator info
            const new_bep = await BEPModel.create({
                product_name,
                variable_cost_per_unit,
                fixed_cost,
                selling_price_per_unit,
                bep_unit,
                createdBy: req.account._id // save user who created the BEP
            });

            res.status(200).json(new_bep);
        } catch (err) {
            console.error(err);
            res.status(500).send(`Failed to create new BEP: ${err}`);
        }
    }
);
// ==================== UPDATE BEP ====================
// Only admin or the user who created the BEP can update
bepRoute.put(
    "/:id",
    authorize(["admin","customer"]), // Check user role
    updateBepRules, // Validation middleware
    async (req, res) => {
        try {
            const id = req.params.id;

            // Fetch the BEP from the database
            const bep = await BEPModel.findById(id);
            if (!bep) return res.status(404).json({ message: "BEP not found" });

            const isAdmin = req.account.roles.includes("admin");

            // If the user is not an admin, they must be the creator of the BEP
            if (!isAdmin && bep.createdBy.toString() !== req.account._id) {
                return res.status(403).json({ message: "Forbidden: cannot update other's BEP" });
            }

            // Update the BEP with new data and run validators
            const updated_bep = await BEPModel.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            // Return the updated BEP
            res.status(200).json(updated_bep);
        } catch (err) {
            console.error(err);
            res.status(500).send(`Failed to update BEP: ${err}`);
        }
    }
);


// ==================== DELETE BEP ====================
// Only admin or the user who created the BEP can delete
bepRoute.delete(
    "/:id",
    authorize(["admin","customer"]), // Check user role
    async (req, res) => {
        try {
            const id = req.params.id;

            // Fetch the BEP first to check if it exists
            const bep = await BEPModel.findById(id);
            if (!bep) return res.status(404).json({ message: "BEP not found" });

            const isAdmin = req.account.roles.includes("admin");

            // If the user is not an admin, they must be the creator
            if (!isAdmin && bep.createdBy.toString() !== req.account._id) {
                return res.status(403).json({ message: "Forbidden: cannot delete other's BEP" });
            }

            // Delete the BEP
            const deleted_bep = await BEPModel.findByIdAndDelete(id);

            // Return the deleted BEP
            res.status(200).json(deleted_bep);
        } catch (err) {
            console.error(err);
            res.status(500).send(`Failed to delete BEP: ${err}`);
        }
    }
);


module.exports = bepRoute;
