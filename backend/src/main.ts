import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import config from './config/configuration';
import {SwaggerModule} from '@nestjs/swagger';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import {join} from 'path';
import {cwd} from 'process';
import * as hbs from 'express-handlebars';

async function bootstrap() {
    const PORT = config().port;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        origin: '*',
        allowedHeaders: '*',
        credentials: true
    });
    app.useStaticAssets(join(cwd(), 'public'));
    app.engine('hbs', hbs(config().hbs));
    app.setBaseViewsDir(join(cwd(), 'views'));
    app.setViewEngine('hbs');
    app.use(cookieParser());
    const document = SwaggerModule.createDocument(app, config().swagger);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT, () =>
        console.log(`Server is running on port ${PORT}`),
    );
}

bootstrap();
