const { getAllUsersDB, getUserByIDDB, addUserDB, updateUserDB, deleteUserDB } = require("../models/user-model");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersDB();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET user by ID
const getUserByID = async (req, res) => {
  try {
    const user = await getUserByIDDB(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST new user
const addNewUser = async (req, res) => {
  try {
    const newUser = await addUserDB(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  try {
    const updated = await updateUserDB(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const deleted = await deleteUserDB(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAllUsers, getUserByID, addNewUser, updateUser, deleteUser };
