import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { User } from "src/entity/User";
import LOG from "src/log";
import { getConnection, Repository } from "typeorm";

@Injectable()
export class UserService {
    private userRepository: Repository<User>;
    private connection: any;

    constructor(
        @InjectRepository(User)
        userRepository: Repository<User>
    ) {
        this.userRepository = userRepository;
    }

    async getRevisionDays(id: string): Promise<string[]> {
        let result = await this.userRepository.findOne({
            select: ["REVISION_DAYS"],
            where: {
                ID: id,
            },
        })
        if(result) return JSON.parse(result.REVISION_DAYS)
        return []
    }

    async saveRevisionDays(id: string, day: string) {
        
        let days = await this.getRevisionDays(id);
        if (!days.length) {
            let record = { ID: id, REVISION_DAYS: JSON.stringify([day]) };
            await this.userRepository.save(record);
        } else {
            let update = JSON.stringify([...days, day]);
            await this.userRepository.update({ ID: id }, { REVISION_DAYS: update });
        }
    }

    async clear(id: string) {
        return this.userRepository.delete({ ID: id });
    }
}
