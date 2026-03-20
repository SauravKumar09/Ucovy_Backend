const buildQueryString = (reqQuery) => {
  const qs = new URLSearchParams();
  const query = reqQuery || {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, String(v)));
    } else {
      qs.set(key, String(value));
    }
  }

  const qsString = qs.toString();
  return qsString ? `?${qsString}` : "";
};

exports.getRecentOpenings = async (req, res) => {
  try {
    const apiKey = process.env.CEIPAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "CEIPAL_API_KEY is not set in backend .env" });
    }

    const baseUrl = "https://api.ceipal.com/jobs";
    const url = `${baseUrl}${buildQueryString(req.query)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({
        message: "Failed to fetch jobs from Ceipal",
        details: text || undefined,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Ceipal request failed", error: error.message });
  }
};

