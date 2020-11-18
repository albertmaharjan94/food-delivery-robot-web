const express = require("express");
const router = express.Router();

const tableController = require("../controllers/table.controller");

router.get("/", tableController.index)
router.get("/:id", tableController.show)
router.post("/", tableController.store)
router.put("/:id", tableController.update)
router.delete("/:id", tableController.destroy)

module.exports = router;