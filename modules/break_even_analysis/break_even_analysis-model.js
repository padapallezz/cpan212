const { readFile, writeToFile } = require("../../shared/file-utils");
const filePath = "./data/bep.json";

/**
 * Get all BEP records.
 * @returns {Promise<Array>} - Returns all BEP calculations.
 */
async function getAllBEP() {
  return readFile(filePath);
}

/**
 * Get BEP record by ID.
 * @param {number|string} bepID - BEP record ID.
 * @returns {Promise<Object|undefined>} - Returns BEP record if found.
 * @throws {Error} - If bepID not provided.
 */
async function getBEPByID(bepID) {
  if (!bepID) throw new Error(`Cannot use ${bepID} to get BEP`);
  const allBEP = await getAllBEP();
  return allBEP.find((b) => b.id === Number(bepID));
}

/**
 * Add a new BEP calculation.
 * @param {Object} newBEP - BEP data (fixed_cost, price, variable_cost, units_sold, breakeven_units).
 * @returns {Promise<Object>} - Returns newly added BEP record.
 * @throws {Error} - If newBEP missing.
 */
async function addNewBEP(newBEP) {
  if (!newBEP) throw new Error(`Cannot use ${newBEP} to add BEP`);
  const allBEP = await getAllBEP();
  newBEP = { id: allBEP.length + 1, ...newBEP };
  allBEP.push(newBEP);
  await writeToFile(filePath, allBEP);
  return newBEP;
}

/**
 * Update BEP record by ID.
 * @param {number} bepID - BEP record ID.
 * @param {Object} updatedBEP - Updated data.
 * @returns {Promise<Object>} - Returns updated BEP record.
 * @throws {Error} - If missing parameters or record not found.
 */
async function updateBEP(bepID, updatedBEP) {
  if (!bepID || !updatedBEP) throw new Error(`Cannot use ${bepID} & ${updatedBEP} to update BEP`);
  const allBEP = await getAllBEP();
  const index = allBEP.findIndex((b) => b.id === Number(bepID));
  if (index < 0) throw new Error(`BEP record with ID ${bepID} doesn't exist`);
  allBEP[index] = { ...allBEP[index], ...updatedBEP };
  await writeToFile(filePath, allBEP);
  return allBEP[index];
}

/**
 * Delete BEP record by ID.
 * @param {number} bepID - BEP record ID.
 * @returns {Promise<Object>} - Returns deleted record.
 * @throws {Error} - If ID missing or record not found.
 */
async function deleteBEP(bepID) {
  if (!bepID) throw new Error(`Cannot use ${bepID} to delete BEP`);
  const allBEP = await getAllBEP();
  const index = allBEP.findIndex((b) => b.id === Number(bepID));
  if (index < 0) throw new Error(`BEP record with ID ${bepID} doesn't exist`);
  const [deletedBEP] = allBEP.splice(index, 1);
  await writeToFile(filePath, allBEP);
  return deletedBEP;
}

module.exports = {
  getAllBEP,
  getBEPByID,
  addNewBEP
}