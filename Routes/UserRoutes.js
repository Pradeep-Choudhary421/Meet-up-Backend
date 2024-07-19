const express = require("express");
const router = express.Router();
const { createUser, login, getOtherUser} = require("../Controller/UserControl");
const { isAuthenticated } = require("../Middleware/Auth")
router.post("/create", createUser);
router.post("/login", login);
router.get("/getOther",isAuthenticated, getOtherUser);
module.exports = router;