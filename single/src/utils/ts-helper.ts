/**
 * castUnknown(object, [
 *   {
 *     name: 'converted',
 *     type: CastDefinitionType.BOOLEAN
 *   }
 * ])
 */
export function castUnknownObject<T>(someObject: unknown, castDefinitions: Map<string, CastDefinitionType>): T | null {
  if (typeof someObject === 'undefined' || someObject === null) {
    return null;
  }
  if (typeof someObject !== 'object') {
    return null;
  }
  const objectProperties: string[] = Object.getOwnPropertyNames(someObject);

  if (objectProperties.length < castDefinitions.size) {
    return null;
  }


  const keysIterator = castDefinitions.keys();
  let currProperty = keysIterator.next().value;

  while (currProperty) {
    if (!objectProperties.includes(currProperty)) {
      return null;
    }

    const propertyDefinition = castDefinitions.get(currProperty);

    if (!propertyDefinition!.isObjectPropertyOfType(someObject[currProperty])) {
      return null;
    }

    currProperty = keysIterator.next().value;
  }

  return someObject as T;
}

export class CastDefinitionType {
  static _TYPE_OF_OBJECT = 'object';
  static _TYPE_OF_NULL = 'null';

  static STRING = new CastDefinitionType('string');
  static NUMBER = new CastDefinitionType('number');
  static BOOLEAN = new CastDefinitionType('boolean');
  static NULL = new CastDefinitionType('null');

  static OBJECT(castDefinitions: Map<string, CastDefinitionType>): CastDefinitionType {
    return new CastDefinitionType(this._TYPE_OF_OBJECT, castDefinitions);
  }

  public typeAsString: string;
  public castDefinitions: Map<string, CastDefinitionType> | null;
  public alternativeTypes: CastDefinitionType[] | null;

  constructor(
    typeAsString: string,
    castDefinitions: Map<string, CastDefinitionType> | null = null,
    alternativeTypes: CastDefinitionType[] | null = null
  ) {
    this.typeAsString = typeAsString.toLowerCase();
    this.castDefinitions = castDefinitions;
    this.alternativeTypes = alternativeTypes;
  }

  or(otherDefinition: CastDefinitionType): CastDefinitionType {
    if (this.typeAsString === CastDefinitionType._TYPE_OF_OBJECT) {
      throw new Error('Invalid function call');
    }

    if (this.alternativeTypes === null) {
      this.alternativeTypes = [];
    }

    this.alternativeTypes.push(otherDefinition);

    return this;
  }

  equals(other: CastDefinitionType): boolean {
    return this.typeAsString == other.typeAsString;
  }

  isObjectPropertyOfType(someValue: unknown): boolean {
    if (typeof someValue === 'undefined') {
      return false;
    }

    if (this.typeAsString === CastDefinitionType._TYPE_OF_OBJECT) {
      if (this.castDefinitions === null) {
        return false;
      }
      return castUnknownObject(someValue, this.castDefinitions) !== null;
    }

    if (this.alternativeTypes !== null) {
      return (typeof someValue).toLowerCase() === this.typeAsString
        || this.alternativeTypes.some((a) => a.isObjectPropertyOfType(someValue));
    }

    if (this.typeAsString === CastDefinitionType._TYPE_OF_NULL) {
      return someValue === null;
    }

    return (typeof someValue).toLowerCase() === this.typeAsString;
  }
}

// TODO add tests and benchmark
// TODO improve map syntax
// console.log(castUnknownObject(
//   { data: { converted: false }, name: 'random', timestamp: null },
//   new Map<string, CastDefinitionType>([
//     [
//       'data',
//       CastDefinitionType.OBJECT(
//         new Map<string, CastDefinitionType>([
//           [
//             'converted',
//             CastDefinitionType.STRING.or(CastDefinitionType.BOOLEAN)
//           ]
//         ])
//       )
//     ],
//     [
//       'name',
//       CastDefinitionType.STRING.or(CastDefinitionType.NULL)
//     ],
//     [
//       'timestamp',
//       CastDefinitionType.STRING.or(CastDefinitionType.NULL)
//     ]
//   ])
// ));