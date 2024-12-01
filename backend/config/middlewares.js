module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000', 'http://localhost:1337', 'https://quizai-weld.vercel.app', 'https://quizai-backend.vercel.app'], // specify allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods
      headers: ['Authorization', 'Content-Type', 'bearer'], // specify allowed headers
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
