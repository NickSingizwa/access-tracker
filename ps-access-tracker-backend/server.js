require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { connectDB } = require("./config/db");
const { runScheduledExpiryChecks } = require("./utils/certificateReminders");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const Service = require("./models/Service");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "https://ps-access-tracker.vercel.app"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/certificates", certificateRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Schedule the cron job to run daily at midnight (uses same rules as immediate reminders)
cron.schedule("0 0 * * *", runScheduledExpiryChecks);

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
    {
      name: "Marriage Certificate",
      slug: "marriage-certificate",
      category: "Civil Registration",
      description:
        "Register your marriage and obtain an official marriage certificate for legal and administrative purposes.",
      requirements: [
        "National ID or passport for both parties",
        "Proof of single status or divorce decree (if applicable)",
        "Two witnesses with valid ID",
        "Completed marriage registration form",
        "Passport photos (both parties)",
      ],
      stages: [
        { stageName: "Application", office: "District Civil Status Office", expectedTime: "1 day" },
        { stageName: "Verification", office: "Central Civil Registry", expectedTime: "3 days" },
        { stageName: "Publication", office: "District Notice Board", expectedTime: "14 days" },
        { stageName: "Solemnization / Registration", office: "Authorized Officer", expectedTime: "1 day" },
        { stageName: "Processing", office: "Registry Office", expectedTime: "5 days" },
        { stageName: "Collection", office: "District Civil Status Office", expectedTime: "1 day" },
      ],
    },
  ]);

  console.log("Seeded 4 services");
}

/** Add Marriage Certificate if DB was seeded before this service existed */
async function ensureMarriageCertificateService() {
  const slug = "marriage-certificate";
  const exists = await Service.findOne({ slug });
  if (exists) return;
  await Service.create({
    name: "Marriage Certificate",
    slug,
    category: "Civil Registration",
    description:
      "Register your marriage and obtain an official marriage certificate for legal and administrative purposes.",
    requirements: [
      "National ID or passport for both parties",
      "Proof of single status or divorce decree (if applicable)",
      "Two witnesses with valid ID",
      "Completed marriage registration form",
      "Passport photos (both parties)",
    ],
    stages: [
      { stageName: "Application", office: "District Civil Status Office", expectedTime: "1 day" },
      { stageName: "Verification", office: "Central Civil Registry", expectedTime: "3 days" },
      { stageName: "Publication", office: "District Notice Board", expectedTime: "14 days" },
      { stageName: "Solemnization / Registration", office: "Authorized Officer", expectedTime: "1 day" },
      { stageName: "Processing", office: "Registry Office", expectedTime: "5 days" },
      { stageName: "Collection", office: "District Civil Status Office", expectedTime: "1 day" },
    ],
  });
  console.log("Added Marriage Certificate service to existing database");
}

connectDB()
  .then(() => seedServices())
  .then(() => ensureMarriageCertificateService())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
