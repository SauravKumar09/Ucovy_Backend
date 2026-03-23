const pickField = (obj, key) => {
  if (!obj || typeof obj !== "object") return undefined;
  return obj[key];
};

const mapJob = (root) => ({
  job_code: pickField(root, "job_code"),
  job_title: pickField(root, "job_title"),
  pay_rate___salary: pickField(root, "pay_rate___salary"),
  remote_job: pickField(root, "remote_job"),
  country: pickField(root, "country"),
  states: pickField(root, "states"),
  city: pickField(root, "city"),
  experience: pickField(root, "experience"),
  primary_skills: pickField(root, "primary_skills"),
  job_description: pickField(root, "job_description"),
  number_of_positions: pickField(root, "number_of_positions"),
});

const hasUsefulField = (job) =>
  Boolean(job?.job_code || job?.job_title || job?.job_description);

/**
 * Map Ceipal payload to the required fields.
 * Returns an array for both single-object and list responses.
 */
const mapCeipalJobDetails = (payload) => {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.results)
        ? payload.results
        : payload?.data && typeof payload.data === "object"
          ? [payload.data]
          : payload && typeof payload === "object"
            ? [payload]
            : [];

  return rows.map(mapJob).filter(hasUsefulField);
};

module.exports = { mapCeipalJobDetails };

