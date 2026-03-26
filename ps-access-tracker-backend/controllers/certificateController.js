const Certificate = require("../models/Certificate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const allowedExt = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
    if (allowedExt.includes(ext)) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed"));
  },
});

function toCertificateResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject();
  return {
    id: obj._id.toString(),
    name: obj.certificateName,
    certificateNumber: obj.certificateNumber,
    issueDate: obj.issueDate ? new Date(obj.issueDate).toISOString().split("T")[0] : null,
    expiryDate: obj.expiryDate ? new Date(obj.expiryDate).toISOString().split("T")[0] : null,
    fileName: obj.fileName,
    filePath: obj.filePath,
  };
}

function toAdminCertificateResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject();
  const owner = obj.userId && typeof obj.userId === "object" ? obj.userId : null;
  return {
    id: obj._id.toString(),
    name: obj.certificateName,
    certificateNumber: obj.certificateNumber,
    issueDate: obj.issueDate ? new Date(obj.issueDate).toISOString().split("T")[0] : null,
    expiryDate: obj.expiryDate ? new Date(obj.expiryDate).toISOString().split("T")[0] : null,
    fileName: obj.fileName,
    ownerId: owner?._id?.toString(),
    ownerName: owner?.fullName,
    ownerEmail: owner?.email,
  };
}

async function getAllForAdmin(req, res) {
  try {
    const certificates = await Certificate.find({})
      .populate("userId", "fullName email")
      .sort({ expiryDate: 1 });
    res.json(certificates.map(toAdminCertificateResponse));
  } catch (err) {
    console.error("getAllForAdmin error:", err);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
}

async function getAll(req, res) {
  try {
    const certificates = await Certificate.find({ userId: req.user._id }).sort({
      expiryDate: 1,
    });
    res.json(certificates.map(toCertificateResponse));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
}

async function create(req, res) {
  try {
    const { certificateName, certificateNumber, issueDate, expiryDate } = req.body;
    const name = certificateName || req.body.name;

    if (!name || !certificateNumber || !issueDate || !expiryDate) {
      return res.status(400).json({
        error: "certificateName (or name), certificateNumber, issueDate, and expiryDate are required",
      });
    }

    const certificateData = {
      userId: req.user._id,
      certificateName: name,
      certificateNumber,
      issueDate: new Date(issueDate),
      expiryDate: new Date(expiryDate),
    };

    // Handle file upload if present
    if (req.file) {
      certificateData.filePath = req.file.filename;
      certificateData.fileName = req.file.originalname;
    }

    const certificate = await Certificate.create(certificateData);

    res.status(201).json(toCertificateResponse(certificate));
  } catch (err) {
    console.error("Certificate create error:", err);
    res.status(500).json({ error: "Failed to create certificate: " + err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // Delete associated file if exists
    if (certificate.filePath) {
      const filePath = path.join(uploadsDir, certificate.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Certificate.deleteOne({ _id: id, userId: req.user._id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete certificate" });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { certificateName, certificateNumber, issueDate, expiryDate } = req.body;
    const name = certificateName || req.body.name;

    const certificate = await Certificate.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    if (name) certificate.certificateName = name;
    if (certificateNumber) certificate.certificateNumber = certificateNumber;
    if (issueDate) certificate.issueDate = new Date(issueDate);
    if (expiryDate) certificate.expiryDate = new Date(expiryDate);

    // Handle file upload if present
    if (req.file) {
      try {
        // Delete old file if exists
        if (certificate.filePath) {
          const oldFilePath = path.join(uploadsDir, certificate.filePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        certificate.filePath = req.file.filename;
        certificate.fileName = req.file.originalname;
      } catch (fileErr) {
        console.error("File operation error:", fileErr);
        return res.status(500).json({ error: "Failed to handle file upload: " + fileErr.message });
      }
    }

    await certificate.save();
    res.json(toCertificateResponse(certificate));
  } catch (err) {
    console.error("Certificate update error:", err);
    res.status(500).json({ error: "Failed to update certificate: " + err.message });
  }
}

async function downloadFile(req, res) {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!certificate || !certificate.filePath) {
      return res.status(404).json({ error: "Certificate or file not found" });
    }

    const filePath = path.join(uploadsDir, certificate.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set appropriate headers for download
    res.setHeader("Content-Disposition", `attachment; filename="${certificate.fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Failed to download file" });
  }
}

module.exports = { getAll, getAllForAdmin, create, remove, update, upload, downloadFile };
