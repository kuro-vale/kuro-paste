import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PasteModule } from './paste/paste.module';
import { StarModule } from './star/star.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    AuthModule,
    PasteModule,
    StarModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
