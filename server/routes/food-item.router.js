const express = require("express");
const router = express.Router();

const foodItemController = require("../controllers/food-item.controller");

router.get("/", foodItemController.index)
router.get("/:id", foodItemController.show)
router.post("/", foodItemController.store)
router.put("/:id", foodItemController.update)
router.delete("/:id", foodItemController.destroy)
router.put("/add-image/:id", foodItemController.addImage)
router.delete("/delete-image/:id", foodItemController.deleteImage)

module.exports = router;