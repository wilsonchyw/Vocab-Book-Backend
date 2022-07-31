import { Body, Controller, Delete, Get, Inject, Post, Req, UsePipes } from "@nestjs/common";
import { UserService } from "src/database/user.service";
import { ExactValivation } from "src/validation/exact.pipe";

@Controller()
export class UserController {
    private readonly userService: UserService;

    constructor(
        @Inject(UserService)
        userService: any
    ) {
        this.userService = userService;
    }

    @Get("user")
    getUser(@Req() req) {
        return this.userService.getRevisionDays(req.user);
    }

    @Post("user")
    @UsePipes(new ExactValivation(["day"]))
    setuser(@Req() req, @Body() body: { day: string }) {
        console.log(body)
        return this.userService.saveRevisionDays(req.user, body.day);
    }

    
    @Delete("user")
    delUser(@Req() req) {
        return this.userService.clear(req.user);
    }
    
}
