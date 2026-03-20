const CEIPAL_JOBS_URL = "https://api.ceipal.com/jobs";

const getJobsArrayFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return null;
};

exports.getRecentOpenings = async (req, res) => {
  try {
    const apiKey = process.env.CEIPAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Missing CEIPAL_API_KEY in backend .env" });
    }

    const limitRaw = req.query?.limit;
    const limit = limitRaw !== undefined && limitRaw !== "" ? Number(limitRaw) : null;
    if (limit !== null && Number.isNaN(limit)) {
      return res.status(400).json({ message: "Invalid query param: limit" });
    }

    const ceipalResponse = await fetch(CEIPAL_JOBS_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const contentType = ceipalResponse.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await ceipalResponse.json() : { message: await ceipalResponse.text() };

    const jobs = getJobsArrayFromResponse(payload) ?? payload;
    const jobsLimited = Array.isArray(jobs) && limit ? jobs.slice(0, limit) : jobs;

    // Keep the response shape consistent for the frontend.
    return res.status(ceipalResponse.status).json({
      source: "ceipal",
      jobs: jobsLimited,
      raw: isJson ? payload : undefined,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch CEIPAL jobs", error: error.message });
  }
};

