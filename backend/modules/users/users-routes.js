const { Router } = require("express");
const registerRules = require("./middlewares/register-rules");
const loginRules = require("./middlewares/login-rules");

const UserModel = require("./users-model");
const { matchPassword } = require("../../shared/password-utils");
const { encodeToken } = require("../../shared/jwt-utils");
const authorize = require("../../shared/middlewares/authorize");
const verifyLoginRules = require("./middlewares/verify-login-rules");
const {randomNumberOfNDigits} = require('../../shared/compute-utils');
const sendEmail = require('../../shared/send-utils');
const OTPModel = require("./otp-model");
const usersRoute = Router();

/**
 * Register Route
 */
usersRoute.post("/register", registerRules, async (req, res) => {
  const newUser = req.body;
  const existingUser = await UserModel.findOne({
    email: newUser.email,
  });
  if (existingUser) {
    return res.status(500).json({
      errorMessage: `User with ${newUser.email} already exist`,
    });
  }
  const addedUser = await UserModel.create(newUser);
  if (!addedUser) {
    return res.status(500).send({
      errorMessage: `Oops! User couldn't be added!`,
    });
  }
  const user = { ...addedUser.toJSON(), password: undefined };
  res.json(user);
});

/**
 * Login Route
 */
usersRoute.post("/login", loginRules, async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    return res.status(404).send({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }
  const passwordMatched = matchPassword(password, foundUser.password);
  if (!passwordMatched) {
    return res.status(401).send({
      errorMessage: `Email and password didn't matched`,
    });
  }
  //generate a random 6-digit OTP using randomNumberOfNDigits
  const otp = randomNumberOfNDigits(6)
  //save the OTP in OPTModel
  await OTPModel.findOneAndUpdate(
  { email },
  { otp, createdAt: new Date() },
  { upsert: true, new: true }
);

  //send otp via email using sendEmail
  try{
    await sendEmail(
      email,
      'Your OTP Code',
      `Your OTP is: ${otp}`
    );
    res.json({message: `OTP sent successfully to email`});

  } catch (err) {
    return res.status(500).json({message: `Failed to send OTP`, error: err.message});
  }
  const payload = {
    id: foundUser._id.toString(),
    roles: foundUser.roles,
  };

  const token = encodeToken(payload);

  const user = { ...foundUser.toJSON(), password: undefined };
  // generate access token

  res.json({ user, token });
});

/**
 * Verify Login Route
 */
usersRoute.post("/verify-login", verifyLoginRules, async (req, res) => {
  const { email, otp } = req.body;
  if (!email | !otp) {
    return res.status(400).json({message: "Email and OTP are required"});
  }

  //get saved otp from otpmodel
  const savedOTP = await OTPModel.findOne({email});
  if (savedOTP.otp !== otp) {
    return res.status(400).json({ message: "Verification failed: Invalid OTP" });
  }
  //generate jwt token
  const user = await UserModel.findOne({ email }).select("-password"); 
  const token = encodeToken(user.toObject());

  return res.json({
    message: "Login verified successfully",
    user,
    token,
  });
}
);

/**
 * Get all users Route
 */
usersRoute.get("/", authorize(["admin"]), async (req, res) => {
  const allUsers = await UserModel.find().select("-password");
  if (!allUsers) res.send([]);
  res.json(allUsers);
});

/**
 * Get user by id Route
 */
usersRoute.get("/:id", authorize(["admin", "customer"]), async (req, res) => {
  const userID = req.params.id;
  const isAdmin = req.account.roles.includes("admin");

  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res.status(404).send({ errorMessage: `User with ${userID} doesn't exist` });
  }

  // Only allow customers to access their own profile
  if (!isAdmin && req.account._id !== foundUser._id.toString()) {
    return res.status(403).json({ message: "Forbidden: cannot access other user's profile" });
  }

  res.json(foundUser);
});


/**
 * Update user Route
 */
usersRoute.put("/:id",authorize(["admin", "customer"]), async (req, res) => {
  const userID = req.params.id;
  const isAdmin = req.account.roles.includes('admin');
  const requestedID = req.account._id || req.account.id

  // TODO: If not admin, don't allow to update others account
  if(!isAdmin && requestedID !== userID) {
    return res.status(403).json({message: "Forbidden: cannot update other user's profile" })
  }
  const newUser = req.body;
  if (!newUser) {
    return res.status(421).json({ errorMessage: "Nothing to update" });
  }
  // Only allow admin to change the roles
  if (!isAdmin && newUser.roles) {
    return res.status(401).json({
      errorMessage:
        "You don't have permission to update your role. Please contact the support team for the assistance!",
    });
  }
  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${userID} doesn't exist` });
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    userID,
    {
      $set: newUser,
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res
      .status(500)
      .send({ errorMessage: `Oops! User couldn't be updated!` });
  }
  res.json(updatedUser);
});

/**
 * Delete user Route
 */
usersRoute.delete("/:id", authorize(["admin"]) ,async (req, res) => {
  const userID = req.params.id;
  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${userID} doesn't exist` });
  }
  const deletedUser = await UserModel.findByIdAndDelete(userID).select(
    "-password"
  );
  if (!deletedUser) {
    return res
      .status(500)
      .send({ errorMessage: `Oops! User couldn't be deleted!` });
  }
  res.json(deletedUser);
});

module.exports = usersRoute ;
