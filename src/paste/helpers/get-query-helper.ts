import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function getQuery(
  body = '',
  filename = '',
  extension = '',
  userId = null,
) {
  const query = {
    body: { $regex: '.*' + body + '.*', $options: 'i' },
    filename: { $regex: '.*' + filename + '.*', $options: 'i' },
    extension: { $regex: '.*' + extension + '.*', $options: 'i' },
  };
  if (userId != null) {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException(`${userId} is not a valid ID`);
    query['userId'] = userId;
  }
  return query;
}
