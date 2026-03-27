const express = require("express");
const { getAll, getAllForAdmin, create, remove, update, upload, downloadFile } = require("../controllers/certificateController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { ensureAdmin } = require("../middleware/ensureAdmin");
const { runScheduledExpiryChecks } = require("../utils/certificateReminders");

const router = express.Router();

router.use(authMiddleware);

router.get("/admin/all", ensureAdmin, getAllForAdmin);
router.post("/admin/run-expiry-check", ensureAdmin, async (req, res) => {
  try {
    await runScheduledExpiryChecks();
    res.json({ ok: true, message: "Expiry reminder check completed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to run expiry check" });
  }
});
router.get("/", getAll);
router.post("/", upload.single("certificateFile"), create);
router.put("/:id", upload.single("certificateFile"), update);
router.delete("/:id", remove);
router.get("/:id/download", downloadFile);

module.exports = router;
