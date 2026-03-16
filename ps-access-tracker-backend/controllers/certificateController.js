const Certificate = require("../models/Certificate");

function toCertificateResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject();
  return {
    id: obj._id.toString(),
    name: obj.certificateName,
    certificateNumber: obj.certificateNumber,
    issueDate: obj.issueDate ? new Date(obj.issueDate).toISOString().split("T")[0] : null,
    expiryDate: obj.expiryDate ? new Date(obj.expiryDate).toISOString().split("T")[0] : null,
  };
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

    const certificate = await Certificate.create({
      userId: req.user._id,
      certificateName: name,
      certificateNumber,
      issueDate: new Date(issueDate),
      expiryDate: new Date(expiryDate),
    });

    res.status(201).json(toCertificateResponse(certificate));
  } catch (err) {
    res.status(500).json({ error: "Failed to create certificate" });
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

    const certificate = await Certificate.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    if (certificateName) certificate.certificateName = certificateName;
    if (certificateNumber) certificate.certificateNumber = certificateNumber;
    if (issueDate) certificate.issueDate = new Date(issueDate);
    if (expiryDate) certificate.expiryDate = new Date(expiryDate);

    await certificate.save();
    res.json(toCertificateResponse(certificate));
  } catch (err) {
    res.status(500).json({ error: "Failed to update certificate" });
  }
}

module.exports = { getAll, create, remove, update };
