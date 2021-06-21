/**
 * Constants for common errors to be thrown
 */
import { RestError } from '../errors/rest.error';

export class ErrorsConstants {
  public static resourceNotFound = (resource: string): RestError =>
    new RestError({
      httpStatus: 404,
      message: `Resource of type ${resource} not found`,
      errorCode: `${resource}.not.found`,
    });

  public static insufficientAccountBalanceError = (): RestError =>
    new RestError({
      httpStatus: 400,
      message: 'Insufficient balance to execute the operation',
      errorCode: 'account.insufficient.balance',
    });
}
