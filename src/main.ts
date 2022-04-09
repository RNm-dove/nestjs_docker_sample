import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

// NestJSはgraceful shutdownの仕組みが内蔵されている。
// https://docs.nestjs.com/fundamentals/lifecycle-events
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}
bootstrap();

// shut down server
// graceful shutdown に対応していないNodeJSフレームの場合は自分で実装する必要がある。
// const shutdown = async () => {
//   logger.log('starting stoppable');
//   await app.close();

//   logger.log('starting pg pool end');
//   // this might take a while depending on connections
//   await sequelize.close();
//   logger.log('exiting');
//   process.exit();
// };

// process.on('SIGINT', function onSigint() {
//   logger.log('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ');
//   shutdown().catch((err) => {
//     logger.log('Http server closed.');
//     process.exit(err ? 1 : 0);
//   });
// });

// // quit properly on docker stop
// process.on('SIGTERM', function onSigterm() {
//   logger.log('Got SIGTERM (docker container stop). Graceful shutdown ');
//   shutdown().catch((err) => {
//     logger.log('Http server closed.');
//     process.exit(err ? 1 : 0);
//   });
// });
