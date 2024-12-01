'use strict';

/**
 * attempt service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::attempt.attempt');
