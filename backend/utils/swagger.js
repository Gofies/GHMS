/*import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import * as path from 'path';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'Documentation for my API',
    },
    basePath: '/',
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
        },
        ApiKeyHeader: {
            type: 'apiKey',
            name: 'Api-Key',
            in: 'header',
        },
    },
};

const options = {
    swaggerDefinition,
    apis: [
        `${__dirname}/../routes/*.js`,
        `${__dirname}/../swagger_schemas/*.js`,
    ],
};

export const swaggerSpec = swaggerJSDoc(options);

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerSpec);
*/