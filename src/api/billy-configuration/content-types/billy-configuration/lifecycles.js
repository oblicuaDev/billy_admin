const schedule = require("node-schedule");

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log(`Nueva configuración creada: ${result.id}`);

    // Llama a la función para crear un cron job
    scheduleCronJob(result);
  },

  async afterUpdate(event) {
    const { result } = event;
    console.log(`Configuración actualizada: ${result.id}`);

    // Cancela el cron job anterior si existe
    if (schedule.scheduledJobs[`config-${result.id}`]) {
      schedule.scheduledJobs[`config-${result.id}`].cancel();
    }

    // Vuelve a programar el cron job con los nuevos datos
    scheduleCronJob(result);
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const id = where.id;
    console.log(`Configuración eliminada: ${id}`);

    // Cancela el cron job cuando se elimina la configuración
    if (schedule.scheduledJobs[`config-${id}`]) {
      schedule.scheduledJobs[`config-${id}`].cancel();
    }
  },
};

function scheduleCronJob(config) {
  const { id, start_date, frecuencia_cobros } = config;

  if (start_date && frecuencia_cobros) {
    const startDate = new Date(start_date);
    console.log(
      `Programando cron job para la configuración ID: ${id} que comenzará el ${startDate} con una frecuencia de ${frecuencia_cobros} días.`
    );

    // Programa el cron job y guarda el trabajo con un identificador único basado en el ID de la configuración
    schedule.scheduleJob(
      `config-${id}`, // Identificador único para el cron job
      { start: startDate, rule: `*/${frecuencia_cobros} * * * *` },
      async () => {
        console.log(`Ejecutando cron job para la configuración ID: ${id}`);

        // Aquí puedes realizar la acción deseada
        await strapi.services[
          "api::billy-configuration.billy-configuration"
        ].find();

        console.log(
          `Cron job ejecutado exitosamente para la configuración ID: ${id}`
        );
      }
    );
  }
}
