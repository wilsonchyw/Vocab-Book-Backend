import { Module } from "@nestjs/common";
import { User } from "src/entity/User";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/database/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
