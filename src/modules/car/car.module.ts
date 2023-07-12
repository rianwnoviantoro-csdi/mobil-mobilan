import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/entities/car.entity';
import { CarController } from './controllers/car.controller';
import { CarService } from './services/car.service';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), BrandModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
