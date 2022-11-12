import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Confirmation(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ConfirmationConstrain,
    });
  };
}

@ValidatorConstraint({ name: 'Confirmation' })
export class ConfirmationConstrain implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments) {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return value === relatedValue;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (
      validationArguments.property +
      ' must match ' +
      validationArguments.constraints[0]
    );
  }
}
