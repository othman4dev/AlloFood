const clientController = require("../controllers/client/clientController");

const express = require("express");
const router = express.Router();

router.get("/me", [''], clientController.getClient);

module.exports = router;