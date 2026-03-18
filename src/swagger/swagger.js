const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'RRPRO API',
            version: '1.0.0',
            description: 'API para la gestion de stock de productos de RRPRO',
            contact: {
                name: 'Los pibe'
            },
            servers: [
                {
                    url: 'http://0.0.0.0:' + (process.env.PORT || 3000),
                    description: 'Local server'
                }
            ]
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;