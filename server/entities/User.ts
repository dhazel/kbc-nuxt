import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column()
    email: string;

    @Column({ default: 0 })
    prayerOrders: number;

    @Column({ default: 0 })
    prayerResponses: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;

    @Column({ default: 0 })
    visitCount: number;
}
