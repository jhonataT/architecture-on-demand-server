import * as bcrypt from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  fullname: string;

  @Column({ nullable: false, unique: true, type: 'varchar', length: 50 })
  phone: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  gender: string;
  
  @Column({ nullable: false, type: 'int' })
  age: number;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: 'ARCHITECT' | 'CLIENT';

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  hashSalt: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.hashSalt);
    return hash === this.password;
  }
}
