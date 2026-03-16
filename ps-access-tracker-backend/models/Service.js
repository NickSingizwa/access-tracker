const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema(
  {
    stageName: { type: String, required: true },
    office: { type: String, required: true },
    expectedTime: { type: String, required: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    stages: [stageSchema],
    slug: { type: String, unique: true, sparse: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Service", serviceSchema);
