import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
class HeroClass extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({type: "varchar", length: 50})
    public name!: string;

    @Field(() => String, {nullable: true})
    @Column({type: "varchar", nullable: true, default: null, name: "image_url"})
    public imageUrl!: string;
}

export {HeroClass};
