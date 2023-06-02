import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WorkRequestsModule } from './work-requests/work-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'development.env' }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    WorkRequestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
