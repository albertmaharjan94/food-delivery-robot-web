const express = require("express");
const router = express.Router();

const { index, store, show, update, destroy } = require("../controllers/category.controller");

router.get("/", index)
router.get("/:id", show)
router.post("/", store)
router.put("/:id", update)
router.delete("/:id", destroy)

module.exports = router;