import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) return res.status(401).json({ message: "Unauthorized access" })
        //console.log("auth success in middleware",req.headers.authorization)
        next()
    }
}