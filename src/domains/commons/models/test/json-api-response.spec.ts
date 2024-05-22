import { ErrorObject } from 'src/exceptions/models/error-object';
import { JsonApiResource, JsonApiResponse } from '../json-api-response';

// Mock data for testing
const mockErrorObject: ErrorObject = {
  title: 'Bad Request',
  detail: 'Invalid input',
};

const mockBookAttributes = {
  code: 'T1',
  title: 'Test Book',
  author: 'Author Name',
  stock: 10,
};

const mockBookResource: JsonApiResource<typeof mockBookAttributes> = {
  type: 'book',
  id: '1',
  attributes: mockBookAttributes,
  relationships: {},
};

const mockErrorResponse: JsonApiResponse<typeof mockBookAttributes> = {
  errors: [mockErrorObject],
};

// Test cases
describe('JsonApiResponse Interface', () => {
  it('should correctly structure a JSON:API resource', () => {
    expect(mockBookResource.type).toBe('book');
    expect(mockBookResource.id).toBe('1');
    expect(mockBookResource.attributes.code).toBe('T1');
    expect(mockBookResource.attributes.title).toBe('Test Book');
    expect(mockBookResource.attributes.author).toBe('Author Name');
    expect(mockBookResource.attributes.stock).toBe(10);
  });

  it('should correctly structure a JSON:API response with errors', () => {
    expect(mockErrorResponse.errors).toBeDefined();
    if (mockErrorResponse.errors) {
      expect(mockErrorResponse.errors.length).toBe(1);
      expect(mockErrorResponse.errors[0].title).toBe('Bad Request');
    }
  });
});
