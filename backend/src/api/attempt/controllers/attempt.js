'use strict';

/**
 * attempt controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::attempt.attempt');
