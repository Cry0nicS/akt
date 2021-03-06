import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, Int, ObjectType} from "type-graphql";
import * as jf from "joiful";
import {HeroAscendancy} from "../../hero-ascendancy/models/hero-ascendancy";

@Entity("hero_classes")
@ObjectType()
class HeroClass {
    @Field(() => Int)
    @jf.number().positive().required()
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column({unique: true, type: "varchar", length: 50})
    @Field(() => String)
    @jf.string().required().max(50)
    public name!: string;

    @Field(() => String, {nullable: true})
    @Column({default: null, name: "image_url", nullable: true, type: "varchar"})
    @jf.string().optional().min(1).max(255).uri({allowRelative: false})
    public imageUrl!: string;

    @OneToMany(() => HeroAscendancy, (heroAscendancy) => heroAscendancy.heroClass, {cascade: true})
    @Field(() => [HeroAscendancy], {nullable: true})
    @jf.array({elementClass: HeroAscendancy}).optional()
    public heroAscendancies!: HeroAscendancy[];
}

export {HeroClass};
