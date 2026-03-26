const express = require("express");
const { getAll, getById, create, update } = require("../controllers/serviceController");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getAll);
router.post("/", adminMiddleware, create);
router.get("/:id", getById);
router.put("/:id", adminMiddleware, update);

module.exports = router;
