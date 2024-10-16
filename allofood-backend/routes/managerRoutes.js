const managerController = require("../controllers/manager/managerController");

const express = require("express");
const router = express.Router();

router.get("/me", [''], managerController.getManager);

module.exports = router;