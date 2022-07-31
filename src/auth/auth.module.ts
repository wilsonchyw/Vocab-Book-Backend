import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { RedisCacheModule } from 'src/database/cache.module';
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
        RedisCacheModule        
    ],
    providers: [
        FirebaseAuthStrategy,        
    ],
    exports: [
        PassportModule
    ]
})
export class AuthModule {}