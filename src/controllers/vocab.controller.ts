import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res, UsePipes } from "@nestjs/common";
import { VocabService } from "src/database/vocab.service";
import { Vocab } from "src/entity/Vocab";
import exprtCSV from "src/lib/toCSV";
import * as message from "src/message.json";
import { AtLeastValivation } from "src/validation/atLeast.pipe";
import { AtMostValivation } from "src/validation/atMost.pipe";
import { ExactValivation } from "src/validation/exact.pipe";

function uuid(): string {
    const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    return s4() + s4();
}

@Controller()
export class VocabController {
    private readonly vocabService: VocabService;

    constructor(
        @Inject(VocabService)
        vocabService: any
    ) {
        this.vocabService = vocabService;
    }

    @Get("vocab")
    async getVocab(@Req() req): Promise<Vocab[]> {
        const userId = req.user;
        return this.vocabService.getAll(userId);
    }

    @Get("vocab/export")
    async exportCSV(@Req() req, @Res() res): Promise<typeof res> {
        const userId = req.user;
        const vocabs = await this.vocabService.getAll(userId);
        const csv = exprtCSV(vocabs);
        res.attachment("export.csv");
        res.set("Content-Type", "application/octet-stream");
        return res.status(200).send(csv);
    }

    @Post("vocab")
    @UsePipes(new AtLeastValivation(["type", "meaning", "vocabulary", "inflection"]))
    async insertVocab(@Req() req, @Body() vocab: Vocab): Promise<any> {
        vocab = {
            ...vocab,
            user: req.user,
            createAt: Date.now(),
            id: uuid(),
        };
        return this.vocabService.insert(req.user, vocab);
    }

    @Put("vocab")
    @UsePipes(new AtMostValivation(["type", "meaning", "vocabulary", "inflection", "id", "createAt", "user", "example", "revision"]))
    async updateVocab(@Req() req, @Body() vocab: Vocab): Promise<any> {
        const userId = req.user;
        const { id, user, ...content } = vocab;
        return this.vocabService.update(userId, id, content);
    }

    @Delete("vocab/:id")
    async deleteVocab(@Req() req, @Param("id") id: string): Promise<any> {
        const userId = req.user;
        return this.vocabService.delete(userId, id);
    }

    @Delete("vocab")
    @UsePipes(new ExactValivation(["id"]))
    async deleteVocabFromBody(@Req() req, @Body() body: { id: string }): Promise<any> {
        const userId = req.user;
        return this.vocabService.delete(userId, body.id);
    }

    @Put("vocab/:id")
    async increaseCorrect(@Req() req, @Param("id") id: string): Promise<any> {
        const userId = req.user;
        return this.vocabService.increaseCorrect(userId, id);
    }

    @Get("message")
    getMessage() {
        return message;
    }
}
