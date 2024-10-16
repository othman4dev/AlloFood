const deliveryController = require("../controllers/delivery/DeliveryController");

const express = require("express");
const router = express.Router();

router.get("/me", [''], deliveryController.getDelivery);

module.exports = router;