import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Cache } from "cache-manager";
import { auth } from "firebase-admin";
import { ExtractJwt, Strategy } from "passport-firebase-jwt";
import LOG from "src/log";

const TEST_USER = "test_user"

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
    private cacheManager: Cache;
    constructor(
        @Inject(CACHE_MANAGER)
        cacheManager: Cache
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
        this.cacheManager = cacheManager;
    }

    async validate(token) {
        LOG("Using async validate");        
        let start = new Date().getTime();

        // For test usage only, send request with token "test"
        if (token === "test") {
            LOG("Request by test user");
            return TEST_USER;
        }

        // Check if token is cached
        let result = await this.cacheManager.get(token);
        if (result) {
            LOG("Token in cache, process time: ", new Date().getTime() - start, "ms");
            return result;
        }

        // Validate by firebase
        try {
            let decodedToken = await auth().verifyIdToken(token);
            this.cacheManager.set(token, decodedToken.uid, { ttl: decodedToken.exp - Math.round(Date.now() / 1000) });
            LOG("Verify token by firebase, process time: ", new Date().getTime() - start, "ms");
            return decodedToken.uid;
        } catch (err) {
            LOG(err);
            throw new UnauthorizedException();
        }
    }
    /** 
    validate(token) {
        let start = new Date().getTime();

        if (token === "test") {
            LOG("Request by test user");
            return "test_user";
        }

        return new Promise((resolve, reject) => {
            this.cacheManager.get(token, (err, result: any) => {
                if (result) {
                    LOG("Token in cache, process time: ", new Date().getTime() - start, "ms");
                    return resolve(result);
                }

                auth()
                    .verifyIdToken(token, true)
                    .then((decodedToken: any) => {
                        //console.log(decodedToken)
                        this.cacheManager.set(token, decodedToken.uid, { ttl: decodedToken.exp - Math.round(Date.now() / 1000) });
                        LOG("Verify token by firebase, process time: ", new Date().getTime() - start, "ms");
                        return resolve(decodedToken.uid);
                    })
                    .catch((err) => {
                        console.log(err);
                        throw new UnauthorizedException();
                    });
            });
        });
    }
    */
}
