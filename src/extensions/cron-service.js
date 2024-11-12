const schedule = require("node-schedule");

module.exports = {
  listCronJobs: () => {
    const jobs = schedule.scheduledJobs; // Obtener todos los cron jobs programados

    console.log("Cron jobs programados actualmente:");
    Object.keys(jobs).forEach((jobName) => {
      const job = jobs[jobName];
      console.log(`ID del cron job: ${jobName}`);
      console.log(`Siguiente ejecución: ${job.nextInvocation()}`); // Ver la próxima ejecución
    });
  },
};
