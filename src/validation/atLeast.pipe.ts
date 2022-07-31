import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class AtLeastValivation implements PipeTransform {
    constructor(private keys: string[] ) { }

    transform(obj: any, metadata: ArgumentMetadata) {
        const rest = this.keys.filter((key) => !obj[key]);
        if (rest.length) throw new BadRequestException(`[${this.keys.join(", ")}] is requied in request`);
        return obj
    }
}