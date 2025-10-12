const { readFile, writeToFile } = require("../../shared/file-utils");
const filePath = "./data/users.json";

/**
 * Get all users.
 * @returns {Promise<Array>} - Returns a promise resolving to an array of users.
 */
async function getAllUsers() {
  return readFile(filePath);
}

/**
 * Get a single user by ID.
 * @param {number|string} userID - User ID to retrieve.
 * @returns {Promise<Object|undefined>} - Returns the user object if found.
 * @throws {Error} - If userID is not provided.
 */
async function getUserByID(userID) {
  if (!userID) throw new Error(`Cannot use ${userID} to get user`);
  const allUsers = await getAllUsers();
  return allUsers.find((u) => u.id === Number(userID));
}

/**
 * Add a new user.
 * @param {Object} newUser - User object to add (user_name, password, email).
 * @returns {Promise<Object>} - Returns the newly added user with assigned ID.
 * @throws {Error} - If newUser is not provided.
 */
async function addNewUser(newUser) {
  if (!newUser) throw new Error(`Cannot use ${newUser} to add user`);
  const allUsers = await getAllUsers();
  newUser = { id: allUsers.length + 1, ...newUser };
  allUsers.push(newUser);
  await writeToFile(filePath, allUsers);
  return newUser;
}

/**
 * Update an existing user by ID.
 * @param {number} userID - ID of the user to update.
 * @param {Object} updatedUser - Updated user data (user_name, password, email).
 * @returns {Promise<Object>} - Returns the updated user.
 * @throws {Error} - If parameters missing or user not found.
 */
async function updateUser(userID, updatedUser) {
  if (!userID || !updatedUser)
    throw new Error(`Cannot use ${userID} & ${updatedUser} to update user`);
  const allUsers = await getAllUsers();
  const index = allUsers.findIndex((u) => u.id === Number(userID));
  if (index < 0) throw new Error(`User with ID ${userID} doesn't exist`);
  allUsers[index] = { ...allUsers[index], ...updatedUser };
  await writeToFile(filePath, allUsers);
  return allUsers[index];
}

/**
 * Delete a user by ID.
 * @param {number} userID - ID of the user to delete.
 * @returns {Promise<Object>} - Returns the deleted user.
 * @throws {Error} - If userID missing or user not found.
 */
async function deleteUser(userID) {
  if (!userID) throw new Error(`Cannot use ${userID} to delete user`);
  const allUsers = await getAllUsers();
  const index = allUsers.findIndex((u) => u.id === Number(userID));
  if (index < 0) throw new Error(`User with ID ${userID} doesn't exist`);
  const [deletedUser] = allUsers.splice(index, 1);
  await writeToFile(filePath, allUsers);
  return deletedUser;
}

module.exports = {
  getAllUsers,
  getUserByID,
  addNewUser,
  updateUser,
  deleteUser,
};
