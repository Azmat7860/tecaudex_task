import { Optional } from '@nestjs/common';
import { IsEmail, IsEnum, IsString, Length, IsDateString, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['north', 'south', 'east', 'west'])
  region: 'north' | 'south' | 'east' | 'west';

  @IsDateString()
  hire_date: string;
}
