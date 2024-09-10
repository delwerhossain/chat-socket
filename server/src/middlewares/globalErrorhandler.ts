import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong!',
    errorDetails: {
      errorType: error.name || 'UnknownError',
      message:
        error.issues[0].message ||
        'An unexpected error occurred while Processing the request',
      errorPath: error.issues[0].path[0] || 'Unknown path',
      error: error,
    },
  });
};
