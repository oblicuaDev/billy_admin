"use strict";

/**
 * record controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const customController = require("./custom-controller");

module.exports = createCoreController("api::record.record", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        invoice: {
          populate: ["etapa", "client"], // Incluye las relaciones dentro de 'invoice'
        },
        billy_user: true,
        channel: {
          populate: ["name", "icon"],
        },
      },
    };

    // Llama al método predeterminado `find`
    const { data, meta } = await super.find(ctx);

    // Devuelve todos los campos, incluyendo las relaciones
    return { data, meta };
  },
  // Método para crear múltiples registros de "record"
  async createMultiple(ctx) {
    try {
      const dataArray = ctx.request.body;

      // Validamos que sea un array
      if (!Array.isArray(dataArray)) {
        return ctx.badRequest("Se esperaba un array de objetos.");
      }

      // Creamos los registros de forma masiva
      const createdRecords = await Promise.all(
        dataArray.map((data) =>
          strapi.entityService.create("api::record.record", {
            data,
          })
        )
      );

      return ctx.send(createdRecords);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  // Método para editar múltiples registros de "record"
  async updateMultiple(ctx) {
    try {
      const dataArray = ctx.request.body;

      // Validamos que sea un array
      if (!Array.isArray(dataArray)) {
        return ctx.badRequest("Se esperaba un array de objetos.");
      }

      // Actualizamos los registros de forma masiva
      const updatedRecords = await Promise.all(
        dataArray.map((data) => {
          if (!data.id) {
            return ctx.badRequest("Cada objeto debe contener un id.");
          }

          return strapi.entityService.update("api::record.record", data.id, {
            data,
          });
        })
      );

      return ctx.send(updatedRecords);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async createBulkEntries(ctx) {
    try {
      const { clients, invoices, records } = ctx.request.body;

      // Almacenamos los IDs de los clientes creados o encontrados
      const clientIds = await Promise.all(
        clients.map(async (clientData) => {
          // Verificamos si el cliente ya existe por su correo
          const existingClient = await strapi.entityService.findMany(
            "api::client.client",
            {
              filters: { email: clientData.email },
            }
          );

          if (existingClient.length > 0) {
            // Si el cliente ya existe, devolvemos su ID
            return existingClient[0].id;
          } else {
            // Si no existe, lo creamos y devolvemos su ID
            const createdClient = await strapi.entityService.create(
              "api::client.client",
              {
                data: clientData,
              }
            );
            return createdClient.id;
          }
        })
      );

      // Validar si los números de factura ya existen
      const invoiceIds = await Promise.all(
        invoices.map(async (invoiceData, index) => {
          // Verificar si la factura ya existe por su número
          const foundInvoice = await strapi.entityService.findMany(
            "api::invoice.invoice",
            {
              filters: { number: invoiceData.number },
            }
          );

          if (foundInvoice.length > 0) {
            // Si la factura ya existe, devolvemos su ID
            return foundInvoice[0].id;
          } else {
            // Si la factura no existe, la creamos y devolvemos su ID
            const createdInvoice = await strapi.entityService.create(
              "api::invoice.invoice",
              {
                data: {
                  ...invoiceData,
                  client: clientIds[index], // Asociamos el ID del cliente (ya sea existente o creado)
                },
              }
            );
            return createdInvoice.id;
          }
        })
      );

      // Crear registros y asignar el ID de la factura correspondiente
      const createdRecords = await Promise.all(
        records.map(async (recordData, index) => {
          const correspondingInvoiceId = invoiceIds[index]; // Se asume que el orden de las facturas coincide con los registros

          // Crear el registro con la relación al invoice
          const createdRecord = await strapi.entityService.create(
            "api::record.record",
            {
              data: {
                ...recordData,
                invoice: correspondingInvoiceId, // Asociamos el ID de la factura (existente o recién creada)
              },
            }
          );

          return createdRecord;
        })
      );

      // Devolvemos los resultados finales
      return ctx.send({
        clients: clientIds, // Devolvemos los IDs de los clientes (existentes o creados)
        invoices: invoiceIds, // Devolvemos los IDs de las facturas (existentes o creadas)
        records: createdRecords,
      });
    } catch (err) {
      return ctx.badRequest("Error while creating entries", err.message);
    }
  },
  async customCleanedRecords(ctx) {
    try {
      // Obtener el ID de billy_user dinámicamente desde la query string
      const billyUserId = ctx.query.billy_user_id;

      // Verificar si se proporcionó el ID de billy_user
      if (!billyUserId) {
        return ctx.badRequest("billy_user_id query parameter is required.");
      }

      // Llamada al servicio para obtener los datos con el filtro dinámico
      const records = await strapi.entityService.findMany(
        "api::record.record",
        {
          filters: {
            billy_user: {
              id: billyUserId, // Aplicamos el filtro directamente sobre la relación
            },
          },
          pagination: {
            page: ctx.query.page || 1,
            pageSize: ctx.query.pageSize || 100,
          },
          populate: "*", // Opcional, para incluir relaciones si es necesario
        }
      );

      // Limpiar la respuesta para incluir 'id' y atributos
      const cleanedRecords = records.map((record) => ({
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        date: record.date,
        invoiceid: record.invoice.id,
        invoicenumber: record.invoice.number,
        invoicedue_date: record.invoice.due_date,
        invoicedays_outstanding: record.invoice.days_outstanding,
        invoiceamount: record.invoice.amount,
        invoicecollection_fees: record.invoice.collection_fees,
        invoicecreatedAt: record.invoice.createdAt,
        invoiceupdatedAt: record.invoice.updatedAt,
        billy_userid: record.billy_user.id,
        billy_username: record.billy_user.name,
        billy_useremail: record.billy_user.email,
        billy_userpassword: record.billy_user.password,
        billy_userbalance: record.billy_user.balance,
        billy_usercreatedAt: record.billy_user.createdAt,
        billy_userupdatedAt: record.billy_user.updatedAt,
        billy_usernit: record.billy_user.nit,
        billy_userrazon_social: record.billy_user.razon_social,
        billy_userauto_recharge: record.billy_user.auto_recharge,
        channelid: record.channel.id,
        channelname: record.channel.name,
        channelcreatedAt: record.channel.createdAt,
        channelupdatedAt: record.channel.updatedAt,
        channelicon: record.channel.icon,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      }));

      // Devolver la respuesta limpia
      ctx.send(cleanedRecords);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
}));
