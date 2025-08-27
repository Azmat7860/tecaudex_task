import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { SalesModule } from './modules/sales/sales.module';
import { TargetsModule } from './modules/targets/targets.module';
import { User } from './modules/users/entities/user.entity';
import { Sale } from './modules/sales/entities/sale.entity';
import { Target } from './modules/targets/entities/target.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'task_db',
      entities: [User, Sale, Target],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    SalesModule,
    TargetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
