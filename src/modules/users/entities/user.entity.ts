import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';
import { Target } from '../../targets/entities/target.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'date' })
  hire_date: Date;

  @Column({ type: 'date', nullable: true })
  current_region_start_date: Date;

  @OneToMany(() => Sale, sale => sale.user)
  sales: Sale[];

  @OneToMany(() => Target, target => target.user)
  targets: Target[];
}
