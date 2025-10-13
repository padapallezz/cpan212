const express = require("express");
const {
  getAllUsers,
  getUserByID,
  addNewUser,
  updateUser,
  deleteUser,
} = require("../models/user-model");

const {
  validateUser,
  validateUserUpdate,
} = require("../middlewares/user-validator");

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await getUserByID(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new user
router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await addNewUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
router.put("/:id", validateUserUpdate, async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
