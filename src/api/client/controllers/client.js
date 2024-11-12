"use strict";

/**
 * client controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::client.client", ({ strapi }) => ({
  async find(ctx) {
    // Asegúrate de que todas las relaciones estén pobladas
    ctx.query = {
      ...ctx.query,
      populate: ["billy_user", "invoices"], // Incluye las relaciones que quieras
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
      populate: {
        invoice: {
          populate: ["billy_user", "invoices"], // Relaciona los campos de 'invoice'
        },
        billy_user: true, // Incluye el campo 'billy_user' en el populate
      },
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
          strapi.entityService.create("api::client.client", {
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
}));
