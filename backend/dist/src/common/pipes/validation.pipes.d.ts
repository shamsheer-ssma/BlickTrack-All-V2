import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseUUIDPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
export declare class ParseEmailPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
export declare class SanitizeStringPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
export declare class TrimStringsPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
