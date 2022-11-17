import { FileValidator } from '@nestjs/common';

export class FileBinaryValidator extends FileValidator {
  constructor() {
    super({});
  }

  buildErrorMessage(): string {
    return 'File must not be binary';
  }

  isValid(file: any): boolean | Promise<boolean> {
    return Boolean(
      !file.buffer
        .toString()
        .match(
          /[^\t\r\n\x20-\x7E\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]+/,
        ),
    );
  }
}
