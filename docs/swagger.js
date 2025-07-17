import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Result API',
      version: '1.0.0',
      description: 'API documentation for the Event Result Manager',
    },
    servers: [
      {
        url: '/api',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // You can add more paths for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} 