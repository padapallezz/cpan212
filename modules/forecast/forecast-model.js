const { readFile, writeToFile } = require("../../shared/file-utils");
const filePath = "./data/forecast.json";

/**
 * Get all forecast records.
 * @returns {Promise<Array>} - Returns a promise resolving to an array of forecast records.
 */
async function getAllForecast() {
  return readFile(filePath);
}

/**
 * Get a single forecast by ID.
 * @param {number|string} forecastID - ID of the forecast record.
 * @returns {Promise<Object|undefined>} - Returns the forecast object if found.
 * @throws {Error} - If forecastID is not provided.
 */
async function getForecastByID(forecastID) {
  if (!forecastID) throw new Error(`Cannot use ${forecastID} to get forecast record`);
  const allForecast = await getAllForecast();
  return allForecast.find((f) => f.id === Number(forecastID));
}

/**
 * Add a new forecast record.
 * @param {Object} newForecast - The forecast object to add.
 * @returns {Promise<Object>} - Returns the newly added forecast record.
 * @throws {Error} - If newForecast is not provided.
 */
async function addNewForecast(newForecast) {
  if (!newForecast) throw new Error(`Cannot use ${newForecast} to add forecast`);
  const allForecast = await getAllForecast();
  newForecast = { id: allForecast.length + 1, ...newForecast };
  allForecast.push(newForecast);
  await writeToFile(filePath, allForecast);
  return newForecast;
}

/**
 * Update an existing forecast record by ID.
 * @param {number} forecastID - ID of the forecast record.
 * @param {Object} updatedForecast - Updated data.
 * @returns {Promise<Object>} - Returns the updated forecast record.
 * @throws {Error} - If missing parameters or record not found.
 */
async function updateForecast(forecastID, updatedForecast) {
  if (!forecastID || !updatedForecast)
    throw new Error(`Cannot use ${forecastID} & ${updatedForecast} to update forecast`);
  const allForecast = await getAllForecast();
  const index = allForecast.findIndex((f) => f.id === Number(forecastID));
  if (index < 0) throw new Error(`Forecast record with ID ${forecastID} doesn't exist`);
  allForecast[index] = { ...allForecast[index], ...updatedForecast };
  await writeToFile(filePath, allForecast);
  return allForecast[index];
}

/**
 * Delete a forecast record by ID.
 * @param {number} forecastID - ID of the forecast record.
 * @returns {Promise<Object>} - Returns the deleted forecast record.
 * @throws {Error} - If forecastID missing or record not found.
 */
async function deleteForecast(forecastID) {
  if (!forecastID) throw new Error(`Cannot use ${forecastID} to delete forecast`);
  const allForecast = await getAllForecast();
  const index = allForecast.findIndex((f) => f.id === Number(forecastID));
  if (index < 0) throw new Error(`Forecast record with ID ${forecastID} doesn't exist`);
  const [deletedForecast] = allForecast.splice(index, 1);
  await writeToFile(filePath, allForecast);
  return deletedForecast;
}

module.exports = {
  getAllForecast,
  getForecastByID,
  addNewForecast,
  updateForecast,
  deleteForecast,
};
