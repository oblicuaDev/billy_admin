"use strict";

/**
 * billy-configuration router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::billy-configuration.billy-configuration"
);
