import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "USER"})
export class User {
    @PrimaryColumn()
    ID: string

    @Column()
    REVISION_DAYS: string
}