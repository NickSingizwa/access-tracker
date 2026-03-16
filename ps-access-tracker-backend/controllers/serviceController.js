const Service = require("../models/Service");

function toServiceResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject();
  return {
    id: obj.slug || obj._id.toString(),
    name: obj.name,
    category: obj.category,
    description: obj.description,
    requirements: obj.requirements || [],
    stages: (obj.stages || []).map((s) => ({
      name: s.stageName,
      office: s.office,
      time: s.expectedTime,
    })),
  };
}

async function getAll(req, res) {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services.map(toServiceResponse));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    let service;

    if (/^[a-f\d]{24}$/i.test(id)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(toServiceResponse(service));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
}

async function create(req, res) {
  try {
    const { name, category, description, requirements, stages } = req.body;

    if (!name || !category || !description) {
      return res.status(400).json({ error: "Name, category, and description are required" });
    }

    const normalizedStages = (Array.isArray(stages) ? stages : []).map((s) => ({
      stageName: s.stageName || s.name || "",
      office: s.office || "",
      expectedTime: s.expectedTime || s.time || "",
    }));

    const service = await Service.create({
      name,
      category,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      stages: normalizedStages,
    });

    res.status(201).json(toServiceResponse(service));
  } catch (err) {
    res.status(500).json({ error: "Failed to create service" });
  }
}

module.exports = { getAll, getById, create };
