import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from "cache-manager";
import { Vocab } from 'src/entity/Vocab';
import LOG from "src/log";
import { getConnection, Repository } from 'typeorm';
@Injectable()
export class VocabService {

    private vocabRepository: Repository<Vocab>
    private connection: any
    private cacheManager: Cache

    constructor(
        @InjectRepository(Vocab)
        vocabRepository: Repository<Vocab>,
        @Inject(CACHE_MANAGER)
        cacheManager: Cache
    ) {
        this.vocabRepository = vocabRepository
        this.cacheManager = cacheManager
        this.connection = getConnection();
        LOG("vocab service constructor")
    }

    async getAll(userId: string): Promise<Vocab[]> {
        let result: Vocab[] = await this.cacheManager.get(userId);

        if (result) {
            LOG("Return from cache")
            return result
        }

        result = await this.vocabRepository.find({
            select: ["id", "type", "meaning", "vocabulary", "inflection", "createAt", "example", "revision"],
            where: { user: userId },
            //cache: { id: userId, milliseconds: 86400000 },
        })
        LOG("Return from database")
        this.cacheManager.set(userId, result);
        return result
    }

    async getAllByCache(userId: string): Promise<Vocab[]> {
        const result = await this.vocabRepository.find({
            select: ["id", "type", "meaning", "vocabulary", "inflection", "createAt", "example", "revision"],
            where: { user: userId },
            cache: { id: userId, milliseconds: 86400000 },
        })
        return result
    }


    async insert(userId: string, vocab: Vocab) {
        await this.cacheManager.del(userId);
        //this.connection.queryResultCache.remove([vocab.user]);
        return this.vocabRepository.save(vocab)
    }

    async update(userId: string, id: string, content: any) {
        await this.cacheManager.del(userId);
        //this.connection.queryResultCache.remove([userId]);
        return this.vocabRepository.update({ user: userId, id: id }, { ...content })
    }

    async delete(userId: string, id: string) {
        await this.cacheManager.del(userId);
        //this.connection.queryResultCache.remove([userId]);
        return this.vocabRepository.delete({ user: userId, id: id })
    }

    async increaseCorrect(userId: string, id: string) {
        await this.cacheManager.del(userId);
        //this.connection.queryResultCache.remove([userId]);
        return this.vocabRepository.increment({ user: userId, id: id }, "revision", 1)
    }
}