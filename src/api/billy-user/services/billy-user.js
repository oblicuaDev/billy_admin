'use strict';

/**
 * billy-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::billy-user.billy-user');
