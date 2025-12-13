const { verify, sign } = require("jsonwebtoken");

const SECRET = process.env.TOKEN_SECRET || "supersecret123";

/**
 * Decode a JWT token from Authorization header
 * @param {string} token - "Bearer <jwt>"
 * @returns {object|undefined} decoded payload
 */
const decodeToken = (token) => {
  if (!token) return;
  const parts = token.split(" ");
  if (parts.length !== 2) return;
  try {
    return verify(parts[1], SECRET); //  payload {id, roles}
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return;
  }
};

/**
 * Encode payload into JWT
 * @param {object} payload - {id, roles}
 * @returns {string} token
 */
const encodeToken = (payload) => {
  try {
    return sign(payload, SECRET, { expiresIn: "6h" });
  } catch (err) {
    console.error("JWT sign failed:", err.message);
  }
};

module.exports = { decodeToken, encodeToken };
