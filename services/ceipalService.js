const axios = require("axios");
const CEIPAL_CONFIG = require("../config/ceipal");

const { mapCeipalJobDetails } = require("../utils/ceipalJobMapper");

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;

// Optional: basic in-memory job data caching
// key -> { expiresAt, data }
const jobCache = new Map();

const getToken = async () => {
  const now = Date.now();
  if (cachedAccessToken && now < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  const { email, password, apiKey } = CEIPAL_CONFIG.env;

  if (!email || !password || !apiKey) {
    throw new Error("CEIPAL credentials missing. Check CEIPAL_EMAIL, CEIPAL_PASSWORD, CEIPAL_API_KEY in .env.");
  }

  const authUrl = `${CEIPAL_CONFIG.baseApiUrl}${CEIPAL_CONFIG.authPath}`;

  const res = await axios.post(
    authUrl,
    {
      email,
      password,
      api_key: apiKey,
      json: 1,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
      validateStatus: () => true, // handle errors ourselves
    }
  );

  if (res.status !== 200 && res.status !== 201) {
    const msg =
      typeof res.data === "string"
        ? res.data.slice(0, 300)
        : res.data?.message || res.data?.error || "Failed to create Ceipal auth token";
    throw new Error(`Ceipal createAuthtoken failed (${res.status}): ${msg}`);
  }

  const accessToken = res.data?.access_token;
  if (!accessToken) {
    throw new Error("Ceipal createAuthtoken succeeded but access_token was missing in response.");
  }

  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = Date.now() + CEIPAL_CONFIG.tokenTtlMs;
  return cachedAccessToken;
};

const safeCacheKey = (parts) => parts.map((p) => String(p ?? "")).join("|");

const fetchJobDetails = async ({ portalId, jobDetailsId, paging_length, paging_number }) => {
  const token = await getToken();

  const url = `${CEIPAL_CONFIG.baseApiUrl}${CEIPAL_CONFIG.customJobDetailsBasePath}/${portalId}/${jobDetailsId}`;

  const params = {
    ...(paging_length ? { paging_length } : {}),
    ...(paging_number ? { paging_number } : {}),
  };

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
    timeout: 30000,
    validateStatus: () => true, // handle errors ourselves
  });

  // Handle token expired -> regenerate
  if (response.status === 401) {
    // Clear token and retry once
    cachedAccessToken = null;
    cachedAccessTokenExpiresAt = 0;

    const newToken = await getToken();
    const retry = await axios.get(url, {
      headers: { Authorization: `Bearer ${newToken}` },
      params,
      timeout: 30000,
      validateStatus: () => true,
    });

    if (retry.status !== 200) {
      const details =
        typeof retry.data === "string"
          ? retry.data.slice(0, 300)
          : retry.data?.detail || retry.data?.message || "Failed to fetch Ceipal job details";
      const err = new Error(`Ceipal request failed (${retry.status}): ${details}`);
      err.status = retry.status;
      throw err;
    }

    const mapped = mapCeipalJobDetails(retry.data);
    if (!Array.isArray(mapped) || mapped.length === 0) {
      const err = new Error("Ceipal job details response did not contain expected fields.");
      err.status = 502;
      throw err;
    }
    return mapped;
  }

  if (response.status !== 200) {
    const details =
      typeof response.data === "string"
        ? response.data.slice(0, 300)
        : response.data?.detail || response.data?.message || "Failed to fetch Ceipal job details";

    const err = new Error(`Ceipal request failed (${response.status}): ${details}`);
    err.status = response.status;
    throw err;
  }

  const mapped = mapCeipalJobDetails(response.data);
  if (!Array.isArray(mapped) || mapped.length === 0) {
    const err = new Error("Ceipal job details response did not contain expected fields.");
    err.status = 502;
    throw err;
  }

  return mapped;
};

exports.getJobs = async (req) => {
  const portalId = req.query.portal_id || CEIPAL_CONFIG.env.careerPortalId;
  const jobDetailsId = req.query.custom_job_id || CEIPAL_CONFIG.env.customJobDetailsId;

  if (!portalId) {
    const err = new Error("Portal ID is not set. Add CEIPAL_CAREER_PORTAL_ID (or pass portal_id query param).");
    err.status = 400;
    throw err;
  }
  if (!jobDetailsId) {
    const err = new Error(
      "Custom job details id is not set. Add CEIPAL_CUSTOM_JOB_DETAILS_ID (or pass custom_job_id query param)."
    );
    err.status = 400;
    throw err;
  }

  const paging_length = req.query.paging_length
    ? Number(req.query.paging_length)
    : CEIPAL_CONFIG.defaultPagingLength;
  const paging_number = req.query.paging_number ? Number(req.query.paging_number) : undefined;

  const cacheKey = safeCacheKey([portalId, jobDetailsId, paging_length, paging_number]);
  const now = Date.now();
  const cached = jobCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const data = await fetchJobDetails({ portalId, jobDetailsId, paging_length, paging_number });

  jobCache.set(cacheKey, { data, expiresAt: now + CEIPAL_CONFIG.jobCacheTtlMs });
  return data;
};

