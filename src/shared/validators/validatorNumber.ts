import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNumberArray', async: false })
export class IsNumberArray implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (isNaN(Number(item))) {
        return false;
      }
    }

    return true;
  }

  defaultMessage() {
    return 'Each value in the array must be a number';
  }
}
