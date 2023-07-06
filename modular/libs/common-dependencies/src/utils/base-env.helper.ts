export class BaseEnvHelper {
  static getRequiredString(name: string): string {
    const value: string | undefined = process.env[name];
    if (value === undefined) {
      throw new Error(`Missing required env var: ${name}`);
    }
    return value;
  }

  static getOptionalString(name: string): string | null {
    const value: string | undefined = process.env[name];
    if (value === undefined) {
      return null;
    }
    return value;
  }

  static getOptionalStringOrDefault(name: string, defaultValue: string): string {
    const value: string | null = this.getOptionalString(name);
    if (value === null) {
      return defaultValue;
    }
    return value;
  }

  static getRequiredNumber(name: string): number {
    const value: string = this.getRequiredString(name);
    return this.parseStringToNumber(name, value);
  }

  static getOptionalNumber(name: string): number {
    const value: string | null = this.getOptionalString(name);
    if (value === null) {
      return 0;
    }
    return this.parseStringToNumber(name, value);
  }

  static getOptionalNumberOrDefault(name: string, defaultVal: number): number {
    const value: string | null = this.getOptionalString(name);
    if (value === null) {
      return defaultVal;
    }
    return this.parseStringToNumber(name, value);
  }

  private static parseStringToNumber(name: string, aString: string): number {
    const asNum: number = parseInt(aString);
    if (isNaN(asNum)) {
      throw new Error(`Env var: ${name} should be numeric value`);
    }
    return asNum;
  }

  static getRequiredBoolean(name: string): boolean {
    const value: string = this.getRequiredString(name);
    return this.parseStringToBoolean(name, value);
  }

  static getOptionalBoolean(name: string): boolean {
    const value: string | null = this.getOptionalString(name);
    if (value === null) {
      return false;
    }
    return this.parseStringToBoolean(name, value);
  }

  static getOptionalBooleanOrDefault(name: string, defaultValue: boolean): boolean {
    const value: string | null = this.getOptionalString(name);
    if (value === null) {
      return defaultValue;
    }
    return this.parseStringToBoolean(name, value);
  }

  private static parseStringToBoolean(name: string, aString: string): boolean {
    const asLower: string = aString.toLowerCase();
    if (asLower !== 'true' && asLower !== 'false') {
      throw new Error(`Unparseable boolean value for env var: ${name}`);
    }
    return asLower === 'true';
  }

  static isFlagEnabled(name: string, defaultVal: boolean): boolean {
    const isEnabled = this.getOptionalBooleanOrDefault(name, defaultVal);
    return isEnabled;
  }

  static isFlagDisabled(name: string, defaultVal: boolean): boolean {
    return !this.isFlagEnabled(name, defaultVal);
  }
}
// TODO unit tests