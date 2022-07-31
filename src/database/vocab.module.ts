
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabService } from 'src/database/vocab.service';
import { Vocab } from 'src/entity/Vocab';
import { RedisCacheModule } from './cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([Vocab]), RedisCacheModule],
    providers: [VocabService],
    exports: [VocabService],
})
export class VocabModule { }