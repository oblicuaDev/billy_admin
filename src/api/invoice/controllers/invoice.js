"use strict";

/**
 * invoice controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::invoice.invoice", ({ strapi }) => ({
  async find(ctx) {
    // Asegúrate de que todas las relaciones estén pobladas
    ctx.query = {
      ...ctx.query,
      populate: ["etapa", "client"],
    };

    // Llama al método predeterminado `find`
    const { data, meta } = await super.find(ctx);

    // Devuelve todos los campos, incluyendo relaciones
    return { data, meta };
  },
  async findOne(ctx) {
    // Asegúrate de que todas las relaciones estén pobladas, incluyendo 'invoice' y 'billy_user'
    ctx.query = {
      ...ctx.query,
      populate: ["etapa", "client"],
    };

    // Llama al método predeterminado `findOne`
    const { data, meta } = await super.findOne(ctx);

    // Devuelve el registro específico, incluyendo relaciones
    return { data, meta };
  },
  async createMultiple(ctx) {
    try {
      // Obtenemos los datos del cuerpo de la solicitud
      const dataArray = ctx.request.body;

      // Validamos que sea un array
      if (!Array.isArray(dataArray)) {
        return ctx.badRequest("Se esperaba un array de objetos.");
      }

      // Creamos los registros de forma masiva
      const createdRecords = await Promise.all(
        dataArray.map((data) =>
          strapi.entityService.create("api::invoice.invoice", {
            data,
          })
        )
      );

      // Retornamos los registros creados
      return ctx.send(createdRecords);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async updateMultiple(ctx) {
    try {
      const dataArray = ctx.request.body;

      // Validamos que sea un array
      if (!Array.isArray(dataArray)) {
        return ctx.badRequest("Se esperaba un array de objetos.");
      }

      // Actualizamos los registros de forma masiva
      const updatedInvoices = await Promise.all(
        dataArray.map((data) => {
          if (!data.id) {
            return ctx.badRequest("Cada objeto debe contener un id.");
          }

          return strapi.entityService.update("api::invoice.invoice", data.id, {
            data,
          });
        })
      );

      // Retornamos los registros actualizados
      return ctx.send(updatedInvoices);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
}));
