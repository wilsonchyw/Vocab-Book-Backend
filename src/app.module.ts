import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { FirebaseAuthStrategy } from "src/auth/firebase-auth.strategy";
import { ExportController, UserController, VocabController } from "src/controllers";
import { RedisCacheModule } from "src/database/cache.module";
import { UserModule } from "src/database/user.module";
import { VocabModule } from "src/database/vocab.module";
import { DatabaseModule } from "./database/database.module";
//import { ValidationPipe } from 'src/validation/validation.pipe';
import { AuthMiddleware } from "./middleware/auth.middleware";
import { Logger } from "./middleware/logger.middleware";
@Module({
    imports: [DatabaseModule, VocabModule, AuthModule, RedisCacheModule, UserModule],
    controllers: [VocabController, UserController, ExportController],
    providers: [FirebaseAuthStrategy],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes("vocab");
        //consumer.apply(Logger).forRoutes("vocab");
    }
}
