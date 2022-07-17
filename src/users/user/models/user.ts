import * as jf from "joiful";
import bcrypt from "bcryptjs";
import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, Int, ObjectType} from "type-graphql";

@Entity("users")
@ObjectType()
class User {
    @Field(() => Int)
    @jf.number().positive().required()
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column({unique: true, type: "varchar", length: 50})
    @Field(() => String)
    @jf.string().required().max(50)
    public username!: string;

    @Column({name: "first_name", default: null, length: 75, nullable: true, type: "varchar"})
    @Field(() => String, {nullable: true})
    @jf.string().allow(null).max(75)
    public firstName!: string | null;

    @Column({name: "last_name", default: null, length: 75, nullable: true, type: "varchar"})
    @Field(() => String, {nullable: true})
    @jf.string().allow(null).max(75)
    public lastName!: string | null;

    @Column({unique: true, type: "varchar", length: 255})
    @Field(() => String)
    @jf.string().required().email().min(3).max(255)
    public email!: string;

    @Column({type: "varchar", length: 255})
    @jf
        .string()
        .required()
        .min(8)
        .max(82)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/u)
    public password!: string;

    @Field(() => String, {nullable: true})
    public fullName(): string | null {
        if (this.firstName !== null && this.lastName !== null) {
            return `${this.firstName} ${this.lastName}`;
        }

        return null;
    }

    public async verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    @BeforeInsert()
    private async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @BeforeUpdate()
    private updateDates(): void {
        // TODO: If a password is provided, hash it before updating.
    }
}

export {User};
