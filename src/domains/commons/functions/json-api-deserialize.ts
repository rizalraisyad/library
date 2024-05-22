import { Deserializer } from 'ts-jsonapi';

const dsrlzr = new Deserializer({ keyForAttribute: 'camelCase' });

export function jsonApiDeserialize<T>(payload: unknown): T {
  return dsrlzr.deserialize(payload);
}
