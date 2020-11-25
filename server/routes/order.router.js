const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

router.get("/", orderController.index)
router.get("/:id", orderController.show)
router.post("/", orderController.store)
router.put("/add-items/:id", orderController.addItems)
router.put("/:id", orderController.update)
router.delete("/:id", orderController.destroy)

module.exports = router;