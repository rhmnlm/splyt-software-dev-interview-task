import swaggerJsDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Splyt driver tracker API',
        version: '0.0.1',
        description: 'API list for driver tracker server',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            apiTokenAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'API token required for this route. Example: data-feeder-splyt'
            },
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Path to the API routes in your Node.js application
};

export const swaggerSpec = swaggerJsDoc(options);

// export default swaggerSpec;