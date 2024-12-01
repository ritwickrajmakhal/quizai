'use strict';

/**
 * attempt router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::attempt.attempt');
