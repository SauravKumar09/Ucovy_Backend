const CEIPAL = {
  baseApiUrl: "https://api.ceipal.com",
  authPath: "/v1/createAuthtoken/",
  // Endpoint from your requirement:
  // GET https://api.ceipal.com/getCustomJobPostingDetails/<portalId>/<jobDetailsId>
  customJobDetailsBasePath: "/getCustomJobPostingDetails",
  // Assumption from your requirement.
  tokenTtlMs: 50 * 60 * 1000,
  jobCacheTtlMs: 10 * 60 * 1000,
  defaultPagingLength: 20,
};

const getEnv = (name, fallbackName) => {
  if (process.env[name]) return process.env[name];
  if (fallbackName && process.env[fallbackName]) return process.env[fallbackName];
  return undefined;
};

module.exports = {
  ...CEIPAL,
  env: {
    email: process.env.CEIPAL_EMAIL,
    password: process.env.CEIPAL_PASSWORD,
    apiKey: process.env.CEIPAL_API_KEY,
    careerPortalId: getEnv("CEIPAL_CAREER_PORTAL_ID", "CEIPAL_PORTAL_ID") || process.env.CEIPAL_PORTAL_ID,
    customJobDetailsId: process.env.CEIPAL_CUSTOM_JOB_DETAILS_ID,
  },
};

