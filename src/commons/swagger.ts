import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const defaultExceptionProperties = {
  httpStatus: { type: 'number' },
  message: { type: 'string' },
  errorCode: { type: 'string' },
};

export const resourceNotFoundExceptionSchema: SchemaObject = {
  properties: defaultExceptionProperties,
  example: {
    httpStatus: 404,
    message: 'Resource of type <resource> not found',
    errorCode: '<resource>.not.found',
  },
  title: 'ResourceNotFoundException',
};

export const transactionTypeInvalidException: SchemaObject = {
  properties: defaultExceptionProperties,
  example: {
    message: 'Transaction type is invalid',
    httpStatus: 400,
    errorCode: 'transaction.type.invalid',
  },
  title: 'InvalidTransactionTypeException',
};
