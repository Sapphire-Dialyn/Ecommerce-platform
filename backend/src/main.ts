import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { FileUploadExceptionFilter } from './common/filters/file-upload-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
app.enableCors({
    origin: true, // Hoặc để '*' nếu vẫn lỗi
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Global file upload exception filter
  app.useGlobalFilters(new FileUploadExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('E-commerce Platform API')
    .setDescription('API documentation for the E-commerce Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();