import { ApiResponse } from '@nestjs/swagger';

export const bookResponseSchema = ApiResponse({
  status: 201,
  description: 'Book successfully created',
  schema: {
    type: 'object',
    properties: {
      type: { type: 'string', example: 'book' },
      id: { type: 'string', example: '82176831-9223-420d-8346-9fcc0564e611' },
      attributes: {
        type: 'object',
        properties: {
          author: { type: 'string', example: 'asds' },
          title: { type: 'string', example: 'test' },
          stock: { type: 'number', example: 2 },
          code: { type: 'string', example: 'adsdss' },
          availableQuantity: { type: 'number', example: 2 },
          borrowedQuantity: { type: 'number', example: 0 },
          id: {
            type: 'string',
            example: '82176831-9223-420d-8346-9fcc0564e611',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-05-23T11:51:34.532Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-05-23T11:51:34.532Z',
          },
        },
      },
    },
  },
});
