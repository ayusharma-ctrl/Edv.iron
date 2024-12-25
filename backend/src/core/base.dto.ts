import { ApiProperty } from '@nestjs/swagger';

export class ResponseBaseDTO<T> {
  @ApiProperty({
    name: 'code',
    type: String,
    description:
      'A constant value representing the response. Ideal for making specific client side checks.',
    example: 'RESPONSE_SUCCESSFUL',
  })
  readonly code: string;

  // @ApiProperty({
  //   name: 'success',
  //   type: Boolean,
  //   description: 'A boolean value representing the status of request.',
  //   example: true,
  // })
  // readonly success: boolean;

  @ApiProperty({
    name: 'message',
    type: String,
    description: 'A human readable message describing the response status',
    example: 'successful',
  })
  readonly message: string;

  @ApiProperty({
    name: 'type',
    type: String,
    description: 'The data type of the returned data (array|object)',
    example: 'array',
  })
  readonly type: string;

  @ApiProperty({
    name: 'data',
    description: 'The data returned by the API',
  })
  readonly data: T;
}
