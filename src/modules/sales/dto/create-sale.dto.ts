import { IsNumber, IsPositive, Max, Min, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  user_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(['software', 'hardware', 'consulting', 'support'])
  product_category: 'software' | 'hardware' | 'consulting' | 'support';

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(20)
  commission_rate?: number;
}
