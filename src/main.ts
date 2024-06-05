import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Setup global validation pipe
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder().addBearerAuth({
    description:'Please, enter token in following format: Bearer <JWT>',
    type:'http',
    in:'header',
    name:'Authorization',
    bearerFormat:'Bearer',
    scheme:'Bearer'
  })
    .setTitle('MKS Challenge')
    .setDescription('Backend challenge for the company MKS')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
