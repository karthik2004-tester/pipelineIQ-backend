export const detectExecutionFlow = (parsed) => {
  if (!parsed.jobs) return { type: "unknown", details: [] };

  const jobs = parsed.jobs;
  const jobNames = Object.keys(jobs);

  let hasDependencies = false;
  let independentJobs = 0;

  jobNames.forEach((jobName) => {
    const job = jobs[jobName];

    if (job.needs) {
      hasDependencies = true;
    } else {
      independentJobs++;
    }
  });

  if (!hasDependencies) {
    return {
      type: "parallel",
      details: ["All jobs run independently → fully parallel"],
    };
  }

  if (independentJobs === 0) {
    return {
      type: "sequential",
      details: ["All jobs depend on others → sequential pipeline"],
    };
  }

  return {
    type: "mixed",
    details: [
      `${independentJobs} job(s) run independently`,
      "Some jobs depend on others → partial parallelism",
    ],
  };
};