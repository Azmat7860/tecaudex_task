import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.sales, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 100 })
  product_category: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  commission_rate: number;
}
