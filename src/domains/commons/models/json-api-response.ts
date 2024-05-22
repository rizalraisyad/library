import { ErrorObject } from 'src/exceptions/models/error-object';

export interface JsonApiResource<T> {
  type: string;
  id: string | number;
  attributes: T;
  relationships: unknown;
}

export interface JsonApiResponse<T> {
  data?: JsonApiResource<T> | JsonApiResource<T>[];
  errors?: ErrorObject[];
}
