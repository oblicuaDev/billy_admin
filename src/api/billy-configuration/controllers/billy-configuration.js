"use strict";
const cronService = require("../../../extensions/cron-service");
/**
 * billy-configuration controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::billy-configuration.billy-configuration",
  ({ strapi }) => ({
    async find(ctx) {
      // Asegúrate de que todas las relaciones estén pobladas
      ctx.query = {
        ...ctx.query,
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
              canales: true,
            },
          },
          link_pago: true,
          frecuencia_cobros: true,
          avatar_billy: true,
          cabecera_correo: true,
          firma_correo: true,
          billy_user: true,
          link_drive: true,
        },
      };

      // Llama al método predeterminado `find`
      const { data, meta } = await super.find(ctx);

      // Devuelve todos los campos, incluyendo relaciones
      return { data, meta };
    },
    async listCrons(ctx) {
      cronService.listCronJobs();
      ctx.send({ message: "Cron jobs listados en la consola del servidor" });
    },
    async findOne(ctx) {
      // Asegúrate de que todas las relaciones estén pobladas, incluyendo 'invoice' y 'billy_user'
      ctx.query = {
        ...ctx.query,
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
              canales: true,
            },
          },
          link_pago: true,
          frecuencia_cobros: true,
          avatar_billy: true,
          cabecera_correo: true,
          firma_correo: true,
          billy_user: true,
          link_drive: true,
          client_type: true,
        },
      };

      // Llama al método predeterminado `findOne`
      const { data, meta } = await super.findOne(ctx);

      // Devuelve el registro específico, incluyendo relaciones
      return { data, meta };
    },
  })
);
