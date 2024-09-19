import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import validator from 'validator';

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFileExtension(filename: string): string {
  const lastIndex = filename.lastIndexOf('.');
  return lastIndex < 1 ? '' : filename.substr(lastIndex);
}

export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function IsUuidArray(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    let fakeElements = [];
    registerDecorator({
      name: 'IsUuidArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return `[${fakeElements}] is not uuid`;
        },
        validate(value: string[], args: ValidationArguments) {
          fakeElements = [];
          let isOnlyUuid = true;
          try {
            value.forEach((element) => {
              const result = validator.isUUID(element);
              if (!result) {
                isOnlyUuid = result;
                fakeElements.push(element);
              }
            });
            return isOnlyUuid;
          } catch (e) {
            return false;
          }
        },
      },
    });
  };
}
