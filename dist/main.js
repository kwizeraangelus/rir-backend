"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.enableCors({
            origin: [
                'http://localhost:3000',
                'https://riri.rw',
                'https://www.riri.rw',
            ],
            methods: 'GET,POST,PATCH,DELETE,PUT',
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        });
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
            prefix: '/uploads/',
        });
        const port = Number(process.env.PORT) || 3000;
        await app.listen(port);
        console.log(`🚀 Server running on port ${port}`);
    }
    catch (error) {
        console.error('❌ Application failed to start:', error);
        process.exit(1);
    }
}
void bootstrap();
//# sourceMappingURL=main.js.map