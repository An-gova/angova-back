import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
    const config = new DocumentBuilder()
        .setTitle('Api management')
        .setDescription('AngovAPI')
        .setVersion('1.0')
        .addTag('Anturvoi')
        .addBearerAuth(
            { name:'Authorization',in: 'header',type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'accessToken'
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors();
    await app.listen(3000);
}


bootstrap()
    .then(() => {
      console.log('Application is running');
    })
    .catch((error) => {
      console.error('Error starting the application:', error);
    });
