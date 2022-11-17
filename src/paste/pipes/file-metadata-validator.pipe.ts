import { FileValidator } from '@nestjs/common';

export class FileMetadataValidator extends FileValidator {
  constructor() {
    super({});
  }

  buildErrorMessage(): string {
    return 'Invalid filename or extension';
  }

  isValid(file: any): boolean | Promise<boolean> {
    const metadataRegex = /(.*)(\.[^.]+)$/;
    const filename = file.originalname.match(metadataRegex)[1];
    const extension = file.originalname.match(metadataRegex)[2];
    if (filename.length > 35 || extension.length > 10) return false;
    const validRegex = /[^ -~]/;
    return !validRegex.test(file.originalname);
  }
}
