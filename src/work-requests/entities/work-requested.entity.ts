import { IsNotEmpty } from "class-validator";
import { User } from "../../users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class WorkRequested {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: 'varchar', length: 500 })
    @IsNotEmpty()
    description: string;

    @ManyToOne((type) => User, (user) => user.id)
    @IsNotEmpty()
    @JoinColumn()
    client: User;

    @ManyToOne((type) => User, (user) => user.id)
    @IsNotEmpty()
    @JoinColumn()
    architect: User;

    @Column({ nullable: false, type: 'varchar', length: 20, default: 'Waiting' })
    status: 'Waiting' | 'Accepted' | 'Refused';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    constructor(workRequested?: Partial<WorkRequested>) {
        this.id = workRequested?.id;
        this.description = workRequested?.description;
        this.client = workRequested?.client;
        this.architect = workRequested?.architect;
        this.status = workRequested?.status;
        this.createdAt = workRequested?.createdAt;
        this.updatedAt = workRequested?.updatedAt;
        this.deletedAt = workRequested?.deletedAt;
    }
}
