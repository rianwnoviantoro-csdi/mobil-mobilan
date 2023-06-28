import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Exception } from 'src/utils/custom-exception';

@Catch(Exception)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.statusCode || HttpStatus.BAD_REQUEST;
    const message = exception.message;

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
