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
    const portalId =
      process.env.CEIPAL_PORTAL_ID ||
      process.env.CEIPAL_CAREER_PORTAL_ID ||
      req.query.portal_id;

    if (!apiKey) {
      return res.status(500).json({ message: "CEIPAL_API_KEY is not set in backend .env" });
    }

    if (!portalId) {
      return res.status(500).json({
        message:
          "Portal ID is not set. Add CEIPAL_PORTAL_ID (or CEIPAL_CAREER_PORTAL_ID) in backend .env or pass portal_id query param.",
      });
    }

    const query = {
      ...req.query,
      portal_id: portalId,
      limit: req.query.limit || 20,
    };

    const baseUrl = "https://jobsapi.ceipal.com/APISource/jobapi/jobs";
    const url = `${baseUrl}${buildQueryString(query)}`;
    console.log("Calling Ceipal URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.log("Ceipal error status:", response.status);
      console.log("Ceipal error response:", text);
      return res.status(response.status).json({
        message: "Failed to fetch jobs from Ceipal",
        details: text || undefined,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Ceipal request failed", error: error?.message || String(error) });
  }
};

