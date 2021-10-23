const express = require("express");
const mainController = require("../controllers/Main.js");

const router = express.Router();

// index
router.all("/", (req, res) => res.send("Welcome to hamidmusafa.com api's"));

// Main Route
router.all("/requests", mainController);

//export default router;
module.exports = router;
