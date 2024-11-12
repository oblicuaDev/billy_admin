"use strict";

const { createCoreController } = require("@strapi/strapi").factories;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = createCoreController(
  "api::billy-user.billy-user",
  ({ strapi }) => ({
    async login(ctx) {
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        return ctx.badRequest("Email and password are required");
      }

      // Look for the user by email
      const user = await strapi.db.query("api::billy-user.billy-user").findOne({
        where: { email },
      });

      if (!user) {
        return ctx.badRequest("Invalid credentials");
      }

      // Compare the provided password with the stored password
      // const validPassword = await bcrypt.compare(password, user.password);

      // if (!validPassword) {
      //   return ctx.badRequest("Invalid credentials");
      // }

      // Create a JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET || "defaultsecret", // Make sure to set a secure secret
        { expiresIn: "1h" }
      );

      // Return the token
      return ctx.send({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          nit: user.nit,
          razon_social: user.razon_social,
          balance: user.balance,
          billy_configuration: user.billy_configuration,
          plan: user.plan,
          auto_recharge: user.auto_recharge,
          records: user.records,
        },
      });
    },
    async register(ctx) {
      const { name, email, password, nit, razon_social } = ctx.request.body;

      // Verifica que todos los campos necesarios están presentes
      if (!name || !email || !password || !nit || !razon_social) {
        return ctx.badRequest("Todos los campos son obligatorios");
      }

      // Verifica si el usuario ya existe
      const existingUser = await strapi.db
        .query("api::billy-user.billy-user")
        .findOne({
          where: { email },
        });

      if (existingUser) {
        return ctx.badRequest(
          "El usuario ya existe con ese correo electrónico"
        );
      }

      // Encripta la contraseña utilizando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea el nuevo usuario
      const newUser = await strapi.db
        .query("api::billy-user.billy-user")
        .create({
          data: {
            name,
            email,
            password: hashedPassword, // Guarda la contraseña encriptada
            nit,
            razon_social,
          },
        });

      // Devuelve la respuesta con el nuevo usuario
      return ctx.send({
        message: "Usuario creado exitosamente",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          nit: newUser.nit,
          razon_social: newUser.razon_social,
        },
      });
    },
  })
);
