const express = require("express");
const { getAll, getAllForAdmin, create, remove, update, upload, downloadFile } = require("../controllers/certificateController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { ensureAdmin } = require("../middleware/ensureAdmin");

const router = express.Router();

router.use(authMiddleware);

router.get("/admin/all", ensureAdmin, getAllForAdmin);
router.get("/", getAll);
router.post("/", upload.single("certificateFile"), create);
router.put("/:id", upload.single("certificateFile"), update);
router.delete("/:id", remove);
router.get("/:id/download", downloadFile);

module.exports = router;
