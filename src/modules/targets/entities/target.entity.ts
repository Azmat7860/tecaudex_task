import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('targets')
export class Target {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.targets, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  target_amount: number;
}
