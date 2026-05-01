"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                callback(null, true);
                return;
            }
            if (origin.includes('dariassoft.com.ar')) {
                console.log(`CORS allowed for origin: ${origin}`);
                callback(null, true);
                return;
            }
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error(`Not allowed by CORS: ${origin}`));
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'Accept', 'Origin'],
        exposedHeaders: ['x-total-count', 'x-page-count'],
        optionsSuccessStatus: 200,
        preflightContinue: false,
        maxAge: 3600,
    });
    const port = process.env.APP_PORT || process.env.PORT || 3000;
    await app.listen(port);
    console.log(`RMS API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map