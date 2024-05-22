import { Serializer } from 'ts-jsonapi';
import { BaseJsonApiEntity } from '../entities/abstract-base-json-api.entity';
import { JsonApiResponse } from '../models/json-api-response';
import { camelize } from './manipulate-string';

function assignAttributesAndRelations(obj, keys, relations, attributes) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let element = obj[key];
      if (Array.isArray(element) && element.length > 0) {
        element = element[0];
      }

      if (element instanceof BaseJsonApiEntity) {
        relations[key] = {
          ref: 'id',
          included: true,
          attributes: element.getAttributes(),
        };
      }
      attributes.push(key);
    }
  }
}

export function toJsonApi<T>(input: T): JsonApiResponse<T> {
  if (Array.isArray(input) && input.length < 1) {
    return {
      data: [],
    };
  }

  if (!input) {
    return {
      data: null,
    };
  }

  let keys = Object.keys(input);
  const temp = Array.isArray(input) ? input[0] : input;

  if (Array.isArray(input)) {
    keys = Object.keys(input[0]);
  }

  const relations: any = {};
  const attributes: string[] = [];

  assignAttributesAndRelations(temp, keys, relations, attributes);
  const opts = {
    id: 'id',
    included: true,
    attributes: attributes,
    keyForAttribute: 'camelCase',
    pluralizeType: false,
    ...relations,
  };

  const srlzr = new Serializer(camelize(temp.constructor.name), opts);
  return srlzr.serialize(input);
}
