const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    certificateName: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    notified: { type: Boolean, default: false },
    filePath: { type: String }, // Path to uploaded certificate file
    fileName: { type: String }, // Original file name
  },
  { versionKey: false }
);

module.exports = mongoose.model("Certificate", certificateSchema);
