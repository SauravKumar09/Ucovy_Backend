const pickField = (obj, key) => {
  if (!obj || typeof obj !== "object") return undefined;
  return obj[key];
};

/**
 * Map Ceipal job details payload to the fields you need.
 * We keep this tolerant because Ceipal responses can vary by configuration.
 */
const mapCeipalJobDetails = (payload) => {
  const root = payload?.data ?? payload;

  return {
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
  };
};

module.exports = { mapCeipalJobDetails };

