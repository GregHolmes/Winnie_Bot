import { IANAZone } from 'luxon'
import { ValidationOptions, registerDecorator } from 'class-validator'

/**
 * class-validator validator for validating whether a timezone is legitimate
 *
 * @param validationOptions Options to pass into the validator.
 */
export function IsTimeZone (validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'IsTimeZone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate (timezone: IANAZone): boolean {
          return timezone.isValid
        }
      }
    })
  }
}
