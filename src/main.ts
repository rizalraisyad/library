import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = fs.readFileSync('swagger.yaml', 'utf8');
  const document = YAML.parse(swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
