// AWS_9_containerization

import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@vendia/serverless-express';

import helmet from 'helmet';

import { AppModule } from './app.module';
import type { Callback, Context, Handler } from 'aws-lambda';

const port = process.env.PORT || 4000;

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//
//   app.enableCors({
//     origin: (req, callback) => callback(null, true),
//   });
//   app.use(helmet());
//
//   await app.listen(port);
// }
// bootstrap().then(() => {
//   console.log('App is running on %s port', port);
// });

async function bootstrap(event: any): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();


  return serverlessExpress({ app: expressApp });
}

let server: Handler | undefined;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('EVENT:', JSON.stringify(event));

  server = server ?? (await bootstrap(event));
  return server(event, context, callback);
};