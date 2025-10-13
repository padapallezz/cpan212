const express = require('express');
const router = express.Router();;

const{getAllUsers,getUserByID,addNewUser,updateUser,deleteUser,authenticateUser}=require('../models/user-model');

const{validateUser,validateUserUpdate}=require('../middlewares/user-validator');

/// get all users
router.get('/',getAllUsers);
//get user by id
router.get('/:id',getUserByID);
//post new user
router.post('/',validateUser,addNewUser);
//put update user
router.put('/:id',validateUserUpdate,updateUser);
//delete user
router.delete('/:id',deleteUser);

module.exports= router;