const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Версія стандарту OpenAPI
        info: {
            title: 'HotelHub API',
            version: '1.0.0',
            description: 'Документація API для системи бронювання готелів HotelHub',
            contact: {
                name: 'Твоє Ім\'я'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Локальний сервер розробки'
            }
        ],
        // Налаштування для авторизації за допомогою токена
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    // Вказуємо, де шукати наші коментарі для генерації документації
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;