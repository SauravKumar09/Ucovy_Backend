const PrinciplesContent = require("../models/PrinciplesContent");

const sanitizePrinciples = (input) => {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => ({
      heading: String(item?.heading || "").trim(),
      description: String(item?.description || "").trim(),
      order:
        item?.order === undefined || item?.order === null || item?.order === ""
          ? index
          : Number(item.order),
    }))
    .filter((item) => item.heading && item.description)
    .sort((a, b) => a.order - b.order);
};

exports.getPrinciplesContent = async (req, res) => {
  try {
    let doc = await PrinciplesContent.findOne().sort({ createdAt: -1 });

    if (!doc) {
      doc = await PrinciplesContent.create({
        principles: [],
      });
    }

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch principles content", error: error.message });
  }
};

exports.upsertPrinciplesContent = async (req, res) => {
  try {
    const statementHeading = String(req.body?.statementHeading || "").trim();
    const statementText = String(req.body?.statementText || "").trim();
    const principles = sanitizePrinciples(req.body?.principles);

    if (!statementHeading || !statementText) {
      return res.status(400).json({ message: "Statement heading and statement text are required." });
    }

    const existing = await PrinciplesContent.findOne().sort({ createdAt: -1 });

    let saved;
    if (existing) {
      existing.statementHeading = statementHeading;
      existing.statementText = statementText;
      existing.principles = principles;
      saved = await existing.save();
    } else {
      saved = await PrinciplesContent.create({
        statementHeading,
        statementText,
        principles,
      });
    }

    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to save principles content", error: error.message });
  }
};
