import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "VOCAB"})
export class Vocab {
    @PrimaryColumn()
    id: string

    @Column()
    type: string

    @Column()
    meaning: string

    @Column()
    vocabulary: string

    @Column()
    createAt: number

    @Column()
    example: string

    @Column()
    inflection: string

    @Column()
    user: string

    @Column({ default: 0 })
    revision: number
}
/**
 * export type vocab = {
    id: string | null;
    vocabulary: string;
    meaning: string;
    type: string;
    createAt: number;
    inflection?: inflection;
    example: string[];
    user?: string,
    revision:
};

export type inflection = {
    [key: string]: any
};
*/