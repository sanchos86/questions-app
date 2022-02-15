import {
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  protected errorHttpStatusCode: ErrorHttpStatusCode =
    HttpStatus.UNPROCESSABLE_ENTITY;

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpErrorByCode[this.errorHttpStatusCode]();
      }
      const errors = this.prepareValidationErrors(validationErrors);
      return new HttpErrorByCode[this.errorHttpStatusCode]({ errors });
    };
  }

  private prepareValidationErrors(
    validationErrors: ValidationError[],
  ): Record<string, string>[] {
    return validationErrors.reduce((acc, currValue) => {
      acc.push({
        field: currValue.property,
        description: Object.values(currValue.constraints).join(', '),
      });
      return acc;
    }, []);
  }
}
