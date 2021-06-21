import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RestError } from '../errors/rest.error';
import { Response } from 'express';
import { omit } from 'ramda';
import { serializeError } from 'serialize-error';

@Catch(RestError)
export class RestErrorExceptionFilter implements ExceptionFilter {
  catch(exception: RestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.httpStatus;
    response
      .status(status)
      .json(omit(['name', 'stack'], serializeError(exception)));
  }
}
