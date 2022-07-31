import { Controller, Get, Inject, Req, Res } from "@nestjs/common";
import { VocabService } from "src/database/vocab.service";
import exprtCSV from "src/lib/toCSV";

@Controller()
export class ExportController {
    private readonly vocabService: VocabService;

    constructor(
        @Inject(VocabService)
        vocabService: any
    ) {
        this.vocabService = vocabService;
    }

    @Get("export")
    async exportCSV(@Req() req, @Res() res): Promise<typeof res> {
        const userId = req.user;
        const vocabs = await this.vocabService.getAll(userId);
        const csv = exprtCSV(vocabs);
        res.attachment("export.csv");
        res.set("Content-Type", "application/octet-stream");
        return res.status(200).send(csv);
    }
}
