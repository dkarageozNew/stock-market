import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environment';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('v1');

    if (environment.NODE_ENV !== 'production') {
        app.enableCors({
            credentials: true,
            origin: `http://localhost:${environment.CLIENT_PORT}`
        });
    }

    await app.listen(environment.PORT);
}

bootstrap();
