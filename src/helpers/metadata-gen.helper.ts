import { PasteMetadataDto } from '../paste/dto/paste-metadata.dto';
import { HttpException } from '@nestjs/common';

export function metadataGen(
  count: number,
  hostname: string,
  url: string,
  page = 1,
): PasteMetadataDto {
  if (count == 0) throw new HttpException('', 204);
  if (!url.includes('page=')) url += (url.includes('?') ? '&' : '?') + 'page=1';
  const lastPage = Math.ceil(count / 10);
  const hasPrevious: boolean = page >= 2 && page <= lastPage;
  const hasNext: boolean = page >= 1 && page < lastPage;
  const first = url.replace(/(page=)\d/, '$11');
  const last = url.replace(/(page=)\d/, `$1${lastPage}`);
  const previous = url.replace(/(page=)\d/, `$1${page - 1}`);
  const next = url.replace(/(page=)\d/, `$1${page + 1}`);
  return new PasteMetadataDto(
    count,
    10,
    `${hostname}${first}`,
    `${hostname}${last}`,
    hasPrevious ? `${hostname}${previous}` : undefined,
    hasNext ? `${hostname}${next}` : undefined,
    `${hostname}${url}`,
  );
}
