import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, Int, ObjectType} from "type-graphql";
import * as jf from "joiful";
import {HeroClass} from "../../hero-class/models/hero-class";

@Entity("hero_ascendancy")
@ObjectType()
class HeroAscendancy {
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

    @Field(() => HeroClass, {nullable: false})
    @jf.object({objectClass: HeroClass}).required()
    @JoinColumn({name: "hero_class_id"})
    @ManyToOne(() => HeroClass, (heroClass) => heroClass.heroAscendancies, {
        onDelete: "CASCADE",
        nullable: false
    })
    public heroClass!: HeroClass;
}

export {HeroAscendancy};
