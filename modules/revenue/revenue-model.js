const { readFile, writeToFile } = require("../../shared/file-utils");

const filePath = "./data/revenue.json";

/**
 * Get all revenue records from the revenue.json file.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of revenue records.
 */
async function getAllRevenue() {
  return readFile(filePath);
}

/**
 * Get a single revenue record by its ID.
 * @param {number|string} revenueID - The ID of the revenue record to retrieve.
 * @returns {Promise<Object|undefined>} - Returns the revenue record if found, otherwise undefined.
 * @throws {Error} - If revenueID is not provided.
 */
async function getRevenueByID(revenueID) {
  if (!revenueID) throw new Error(`Cannot use ${revenueID} to get revenue record`);
  const allRevenue = await getAllRevenue();
  return allRevenue.find((r) => r.id === Number(revenueID));
}

/**
 * Add a new revenue record.
 * @param {Object} newRevenue - The revenue object to add.
 * @returns {Promise<Object>} - Returns the newly added revenue record with assigned ID.
 * @throws {Error} - If newRevenue is not provided.
 */
async function addNewRevenue(newRevenue) {
  if (!newRevenue) throw new Error(`Cannot use ${newRevenue} to add revenue record`);
  const allRevenue = await getAllRevenue();
  newRevenue = { id: allRevenue.length + 1, ...newRevenue };
  allRevenue.push(newRevenue);
  await writeToFile(filePath, allRevenue);
  return newRevenue;
}

/**
 * Update an existing revenue record by ID.
 * @param {number} revenueID - The ID of the revenue record to update.
 * @param {Object} updatedRevenue - The updated revenue data.
 * @returns {Promise<Object>} - Returns the updated revenue record.
 * @throws {Error} - If revenueID or updatedRevenue is missing.
 * @throws {Error} - If the revenue record does not exist.
 */
async function updateRevenue(revenueID, updatedRevenue) {
  if (!revenueID || !updatedRevenue) throw new Error(`Cannot use ${revenueID} & ${updatedRevenue} to update revenue record`);
  const allRevenue = await getAllRevenue();
  const index = allRevenue.findIndex((r) => r.id === Number(revenueID));
  if (index < 0) throw new Error(`Revenue record with ID ${revenueID} doesn't exist`);
  allRevenue[index] = { ...allRevenue[index], ...updatedRevenue };
  await writeToFile(filePath, allRevenue);
  return allRevenue[index];
}

/**
 * Delete a revenue record by ID.
 * @param {number} revenueID - The ID of the revenue record to delete.
 * @returns {Promise<Object>} - Returns the deleted revenue record.
 * @throws {Error} - If revenueID is missing or the record does not exist.
 */
async function deleteRevenue(revenueID) {
  if (!revenueID) throw new Error(`Cannot use ${revenueID} to delete revenue record`);
  const allRevenue = await getAllRevenue();
  const index = allRevenue.findIndex((r) => r.id === Number(revenueID));
  if (index < 0) throw new Error(`Revenue record with ID ${revenueID} doesn't exist`);
  const [deletedRevenue] = allRevenue.splice(index, 1);
  await writeToFile(filePath, allRevenue);
  return deletedRevenue;
}

module.exports = {
  getAllRevenue,
  getRevenueByID,
  addNewRevenue,
  updateRevenue,
  deleteRevenue,
};
