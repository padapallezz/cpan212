const express = require("express");
const {
    getAllBreakEvenAnalysis,
    getBreakEvenAnalysisByID,
    addNewBreakEvenAnalysis,
    updateBreakEvenAnalysis,
    deleteBreakEvenAnalysis,
} = require("../models/break_even_analysis-model");

const {
    validateBreakEvenAnalysis,
    validateBreakEvenAnalysisUpdate,
} = require("../middlewares/break_even_analysis-validator");

const router = express.Router();
//get all BEP
router.get("/", getAllBreakEvenAnalysis);
//get BEP by id
router.get("/:id", getBreakEvenAnalysisByID);
//post new BEP
router.post("/", validateBreakEvenAnalysis, addNewBreakEvenAnalysis);
//put update BEP
router.put("/:id", validateBreakEvenAnalysisUpdate, updateBreakEvenAnalysis);
//delete BEP
router.delete("/:id", deleteBreakEvenAnalysis);

module.exports = router;