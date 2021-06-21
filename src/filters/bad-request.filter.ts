import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { RestError } from '../errors/rest.error';
import { ValidationError } from 'class-validator';
import { omit } from 'ramda';
import { serializeError } from 'serialize-error';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let restError: RestError;
    const firstError = (exception.getResponse() as any).message[0];

    if (
      firstError.contexts &&
      firstError.contexts.matches &&
      RestError.isRestError(firstError.contexts.matches)
    ) {
      restError = new RestError(firstError.contexts.matches);
    } else {
      if (
        firstError.constraints ||
        (firstError.children && firstError.children.length)
      ) {
        let validationError: ValidationError = firstError.children[0];
        if (validationError && Array.isArray(validationError.children)) {
          while (validationError.children && validationError.children.length) {
            validationError = validationError.children[0];
          }
        }
        const errorObject =
          firstError.constraints || validationError.constraints;
        restError = new RestError({
          httpStatus: 400,
          message: `Parameter ${
            firstError.property
          } has constraints: ${Object.values(errorObject)}`,
          errorCode: `invalid.request.parameter.${firstError.property}`,
        });
      } else {
        const message = (exception.getResponse() as any).message;
        restError = new RestError({
          httpStatus: 400,
          message,
          errorCode: 'invalid.request.parameter',
        });
      }
    }

    response
      .status(restError.httpStatus)
      .json(omit(['name', 'stack'], serializeError(restError)));
  }
}
