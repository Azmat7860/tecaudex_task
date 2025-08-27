import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThan } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const user = await this.userRepository.findOne({ where: { id: createSaleDto.user_id } });
    if (!user) throw new Error('User not found');
    const commission_rate = await this.calculateCommissionRate(user, createSaleDto);
    const sale = this.saleRepository.create({
      ...createSaleDto,
      user,
      date: new Date(createSaleDto.date),
      commission_rate
    });
    return await this.saleRepository.save(sale);
  }

  async bulkCreate(createSaleDtos: CreateSaleDto[]) {
    const results = [];
    for (const dto of createSaleDtos) {
      results.push(await this.create(dto));
    }
    return results;
  }

  findAll() {
    return this.saleRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.saleRepository.findOne({ where: { id }, relations: ['user'] });
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }

  // --- Commission Calculation Logic ---
  private async calculateCommissionRate(user: User, saleDto: CreateSaleDto): Promise<number> {
    // 1. Calculate total sales for the month
    const saleDate = new Date(saleDto.date);
    const monthStart = new Date(saleDate.getFullYear(), saleDate.getMonth(), 1);
    const monthEnd = new Date(saleDate.getFullYear(), saleDate.getMonth() + 1, 0);
    const monthlySales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.userId = :userId', { userId: user.id })
      .andWhere('sale.date BETWEEN :start AND :end', { start: monthStart, end: monthEnd })
      .select('SUM(sale.amount)', 'total')
      .getRawOne();
    const monthlyTotal = parseFloat(monthlySales.total) || 0;

    // 2. Base commission
    let commission = 5;
    // 3. Tier bonuses
    if (monthlyTotal > 25000) {
      commission += 4;
    } else if (monthlyTotal > 10000) {
      commission += 2;
    }
    // 4. Regional multipliers
    const regionMultipliers: Record<string, number> = {
      north: 1.1,
      south: 0.95,
      east: 1.0,
      west: 1.05,
    };
    const region = user.region.toLowerCase();
    const multiplier = regionMultipliers[region] || 1.0;
    commission *= multiplier;

    // 5. Streak bonus (consecutive months hitting target)
    let streakBonus = 0;
    let streak = 0;
    let prevMonth = new Date(monthStart);
    for (let i = 1; i <= 5; i++) {
      prevMonth.setMonth(monthStart.getMonth() - i);
      const prevStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
      const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
      const prevSales = await this.saleRepository
        .createQueryBuilder('sale')
        .where('sale.userId = :userId', { userId: user.id })
        .andWhere('sale.date BETWEEN :start AND :end', { start: prevStart, end: prevEnd })
        .select('SUM(sale.amount)', 'total')
        .getRawOne();
      const prevTotal = parseFloat(prevSales.total) || 0;
      // Assume user.target for the month is available. For demo, use 10000 as a fixed target.
      const target = 10000;
      if (prevTotal >= target) {
        streak++;
      } else {
        break;
      }
    }
    streakBonus = Math.min(streak, 5); // max 5%
    commission += streakBonus;

    // 6. Performance penalty: previous month <50% of target
    const lastMonth = new Date(monthStart);
    lastMonth.setMonth(monthStart.getMonth() - 1);
    const lastStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
    const lastSales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.userId = :userId', { userId: user.id })
      .andWhere('sale.date BETWEEN :start AND :end', { start: lastStart, end: lastEnd })
      .select('SUM(sale.amount)', 'total')
      .getRawOne();
    const lastTotal = parseFloat(lastSales.total) || 0;
    const target = 10000; // For demo
    if (lastTotal < target * 0.5) {
      commission -= 2;
    }
    // Clamp between 0 and 20
    commission = Math.max(0, Math.min(commission, 20));
    return parseFloat(commission.toFixed(2));
  }
}
