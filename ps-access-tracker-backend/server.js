require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const Service = require("./models/Service");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/certificates", certificateRoutes);

async function seedServices() {
  const count = await Service.countDocuments();
  if (count > 0) return;

  await Service.insertMany([
    {
      name: "Passport Application",
      slug: "passport",
      category: "Immigration",
      description: "Apply for a new passport or renewal. Required for international travel.",
      requirements: [
        "National ID",
        "Passport photos (2 recent photos)",
        "Completed application form",
        "Birth certificate or citizenship proof",
      ],
      stages: [
        { stageName: "Submission", office: "District Office", expectedTime: "1 day" },
        { stageName: "Verification", office: "Immigration HQ", expectedTime: "3 days" },
        { stageName: "Processing", office: "Immigration HQ", expectedTime: "5 days" },
        { stageName: "Approval", office: "Immigration Director", expectedTime: "2 days" },
        { stageName: "Collection", office: "District Office", expectedTime: "1 day" },
      ],
    },
    {
      name: "Driving License",
      slug: "driving-license",
      category: "Transport",
      description: "Obtain a new driving license or renew an existing one.",
      requirements: [
        "National ID",
        "Medical certificate",
        "Passport photos",
        "Completed application form",
        "Proof of residence",
      ],
      stages: [
        { stageName: "Document Submission", office: "District Transport Office", expectedTime: "1 day" },
        { stageName: "Verification", office: "Central Transport Authority", expectedTime: "2 days" },
        { stageName: "Processing", office: "License Division", expectedTime: "5 days" },
        { stageName: "Approval", office: "Director of Transport", expectedTime: "2 days" },
        { stageName: "Collection", office: "District Transport Office", expectedTime: "1 day" },
      ],
    },
    {
      name: "Birth Certificate",
      slug: "birth-certificate",
      category: "Civil Registration",
      description: "Request an official birth certificate from civil registration.",
      requirements: [
        "National ID or parent's ID",
        "Hospital birth record (if available)",
        "Application form",
        "Proof of identity",
      ],
      stages: [
        { stageName: "Submission", office: "District Registry", expectedTime: "1 day" },
        { stageName: "Verification", office: "Central Civil Registry", expectedTime: "3 days" },
        { stageName: "Processing", office: "Registry Office", expectedTime: "4 days" },
        { stageName: "Approval", office: "Registry Director", expectedTime: "1 day" },
        { stageName: "Collection", office: "District Registry", expectedTime: "1 day" },
      ],
    },
  ]);

  console.log("Seeded 3 services");
}

connectDB()
  .then(() => seedServices())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
