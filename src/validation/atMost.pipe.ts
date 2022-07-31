import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class AtMostValivation implements PipeTransform {
    constructor(private keys: string[] ) { }

    transform(obj: any, metadata: ArgumentMetadata) {
        const rest = Object.keys(obj).filter((key) => !this.keys.includes(key));
        if (rest.length) throw new BadRequestException(`[${this.keys.join(", ")}] must exact contain in request`);
        return obj
    }
}