import { ApiResponse } from '@nestjs/swagger';

export const errorResponseCodeExistSchema = ApiResponse({
  status: 400,
  description: 'Bad request',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Create Book Failed' },
            detail: {
              type: 'string',
              example: 'Book with code: adsd already exist',
            },
          },
        },
      },
    },
  },
});

export const errorResponseTitleMustFilledSchema = ApiResponse({
  status: 400,
  description: 'Bad request',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Create Book Failed' },
            detail: {
              type: 'string',
              example: 'Book with code: adsd already exist',
            },
          },
        },
      },
    },
  },
});
