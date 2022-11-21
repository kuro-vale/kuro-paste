import { PasteResponseDto } from './paste-response.dto';
import { PasteMetadataDto } from './paste-metadata.dto';

export class PaginatedPasteDto {
  constructor(metadata: PasteMetadataDto, items: PasteResponseDto[]) {
    this.metadata = metadata;
    this.items = items;
  }

  metadata: PasteMetadataDto;
  items: PasteResponseDto[];
}
