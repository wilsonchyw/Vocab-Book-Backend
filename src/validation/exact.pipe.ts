import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ExactValivation implements PipeTransform {
    constructor(private keys: string[]) { }

    transform(obj: any, metadata: ArgumentMetadata) {
        if (this.keys.length != Object.keys(obj).length) throw new BadRequestException(`[${this.keys.join(", ")}] must exact contain in request`);
        this.keys.forEach((key) => {
            if (!obj[key]) throw new BadRequestException(`[${this.keys.join(", ")}] must exact contain in request`);
        });
        return obj
    }
}