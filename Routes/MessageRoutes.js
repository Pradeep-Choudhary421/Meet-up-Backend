const express = require("express");
const router = express.Router();
const {sendMessage, getMessages} = require("../Controller/MessageControl")
const {isAuthenticated} = require("../Middleware/Auth");
router.post("/send/:id", isAuthenticated, sendMessage)
router.get("/get/:id", isAuthenticated, getMessages)
module.exports = router;