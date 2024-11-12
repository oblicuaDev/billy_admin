const schedule = require("node-schedule");

module.exports = {
  myJob: {
    task: async ({ strapi }) => {
      try {
        // Obtener la configuración de la base de datos
        const configurations = await strapi.entityService.findMany(
          "api::billy-configuration.billy-configuration",
          {
            filters: {
              active: true, // Filtra solo las configuraciones activas
            },
            populate: {
              tonos: {
                populate: {
                  amigable: {
                    populate: {
                      canales: true,
                    },
                  },
                  formal: {
                    populate: {
                      canales: true,
                    },
                  },
                  exigente: {
                    populate: {
                      canales: true,
                    },
                  },
                  con_plantilla: {
                    populate: {
                      canales: true,
                    },
                  },
                },
              },
              link_pago: true,
              frecuencia_cobros: true,
              canal_correo: true,
              canal_sms: true,
              avatar_billy: true,
              cabecera_correo: true,
              firma_correo: true,
              billy_user: true,
              plantilla_correo: true,
              link_drive: true,
              client_type: true,
              start_date: true,
            }, // This will populate all fields and relations
          }
        );

        configurations.forEach((config) => {
          const { id, start_date, frecuencia_cobros } = config;

          // Verificar si ya hay un cron job programado para este config
          if (schedule.scheduledJobs[`config-${id}`]) {
            console.log(`Cron job ya existe para la configuración ID: ${id}`);
            return; // Si ya existe, no lo programes de nuevo
          }

          if (start_date && frecuencia_cobros) {
            const startDate = new Date(start_date); // Convertir la fecha de inicio

            // Programa el cron job y guarda el trabajo con un identificador único basado en el ID de la configuración
            schedule.scheduleJob(
              `config-${id}`, // Identificador único para el cron job
              { start: startDate, rule: `*/${frecuencia_cobros} * * * *` },
              async () => {
                // Ejecuta la lógica del cron job
                console.log(
                  `Ejecutando cron job para la configuración ID: ${id}`
                );
                await strapi.services[
                  "api::billy-configuration.billy-configuration"
                ].find();

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify(config);

                // Puedes habilitar la llamada a fetch si necesitas hacer una petición
                await fetch(
                  "https://hook.us1.make.com/g8p4hjjkpn4xgo818m2bzwb58rvh29us",
                  {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow",
                  }
                )
                  .then((response) => response.text())
                  .then((result) => console.log(result))
                  .catch((error) => console.error(error));
              }
            );

            console.log(
              `Cron job creado para la configuración ID: ${id} que comenzará el ${startDate} con una frecuencia de ${frecuencia_cobros} días.`
            );
          }
        });
      } catch (error) {
        console.error("Error al crear cron jobs dinámicos:", error);
      }
    },
    options: {
      rule: "* * * * *", // Ejecuta el job cada minuto
      start: new Date(Date.now() + 10000), // Comienza en 10 segundos
      end: new Date(Date.now() + 20000), // Termina en 20 segundos
    },
  },
};
