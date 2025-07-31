import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Percel Delivery Software API",
            version: "1.0.0",
        },
        servers: [
            {
                url: "/api/v1",
                description: "Version 1 of the API",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, "../modules/**/*.ts")],
};


const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
