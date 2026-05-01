"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const allowedOrigins = [
                'http://localhost',
                'http://127.0.0.1',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:4173',
                'http://127.0.0.1:4173',
                process.env.FRONTEND_URL,
                'https://rms.dariassoft.com.ar'
            ];
            if (origin.endsWith('.rms.dariassoft.com.ar') || origin === 'https://rms.dariassoft.com.ar') {
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(null, true);
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization, x-tenant-id, Accept, Origin, X-Requested-With',
    });
    const port = process.env.APP_PORT || process.env.PORT || 3000;
    await app.listen(port);
    console.log(`RMS API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map