const { readFile, writeToFile } = require("../../shared/file-utils");
const filePath = "./data/whatif.json";

/**
 * Get all What-If scenarios.
 * @returns {Promise<Array>} - Returns an array of scenarios.
 */
async function getAllWhatIf() {
  return readFile(filePath);
}

/**
 * Get a single What-If scenario by ID.
 * @param {number|string} scenarioID - Scenario ID.
 * @returns {Promise<Object|undefined>} - Returns scenario if found.
 * @throws {Error} - If scenarioID not provided.
 */
async function getScenarioByID(scenarioID) {
  if (!scenarioID) throw new Error(`Cannot use ${scenarioID} to get scenario`);
  const allScenarios = await getAllWhatIf();
  return allScenarios.find((s) => s.id === Number(scenarioID));
}

/**
 * Add a new What-If scenario.
 * @param {Object} newScenario - Scenario object.
 * @returns {Promise<Object>} - Returns added scenario.
 * @throws {Error} - If missing newScenario.
 */
async function addNewScenario(newScenario) {
  if (!newScenario) throw new Error(`Cannot use ${newScenario} to add scenario`);
  const allScenarios = await getAllWhatIf();
  newScenario = { id: allScenarios.length + 1, ...newScenario };
  allScenarios.push(newScenario);
  await writeToFile(filePath, allScenarios);
  return newScenario;
}

/**
 * Update an existing scenario by ID.
 * @param {number} scenarioID - Scenario ID.
 * @param {Object} updatedScenario - Updated data.
 * @returns {Promise<Object>} - Returns updated scenario.
 * @throws {Error} - If missing parameters or scenario not found.
 */
async function updateScenario(scenarioID, updatedScenario) {
  if (!scenarioID || !updatedScenario)
    throw new Error(`Cannot use ${scenarioID} & ${updatedScenario} to update scenario`);
  const allScenarios = await getAllWhatIf();
  const index = allScenarios.findIndex((s) => s.id === Number(scenarioID));
  if (index < 0) throw new Error(`Scenario with ID ${scenarioID} doesn't exist`);
  allScenarios[index] = { ...allScenarios[index], ...updatedScenario };
  await writeToFile(filePath, allScenarios);
  return allScenarios[index];
}

/**
 * Delete a scenario by ID.
 * @param {number} scenarioID - Scenario ID.
 * @returns {Promise<Object>} - Returns deleted scenario.
 * @throws {Error} - If scenarioID missing or not found.
 */
async function deleteScenario(scenarioID) {
  if (!scenarioID) throw new Error(`Cannot use ${scenarioID} to delete scenario`);
  const allScenarios = await getAllWhatIf();
  const index = allScenarios.findIndex((s) => s.id === Number(scenarioID));
  if (index < 0) throw new Error(`Scenario with ID ${scenarioID} doesn't exist`);
  const [deletedScenario] = allScenarios.splice(index, 1);
  await writeToFile(filePath, allScenarios);
  return deletedScenario;
}

module.exports = {
  getAllWhatIf,
  getScenarioByID,
  addNewScenario,
  updateScenario,
  deleteScenario,
};
