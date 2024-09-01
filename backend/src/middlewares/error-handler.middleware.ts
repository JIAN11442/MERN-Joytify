import { ZodError } from "zod";
import { ErrorRequestHandler } from "express";

import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../constants/http-code.constant";
import AppError from "../utils/app-error.util";
import { clearAuthCookies } from "../utils/cookies.util";
import admin from "../config/firebase.config";

const errorHandler = (): ErrorRequestHandler => {
  return async (error, req, res, next) => {
    // clear the cookies while refresh path throws an error
    if (req.path === "/auth/refresh") {
      clearAuthCookies(res);
    }

    // Zod  Error
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => ({
        path: err.path,
        message: err.message,
      }));

      console.log(errors[0]);

      return res.status(BAD_REQUEST).json(errors[0]);
    }

    // Firebase Error
    if (error?.errorInfo?.code && error.errorInfo.code.startsWith("auth/")) {
      return res.status(BAD_REQUEST).json({
        code: error.errorInfo.code,
        message: error.errorInfo.message,
      });
    }

    // App Error
    if (error instanceof AppError) {
      // If firebase auth with third-party provider fails, delete the firebase user
      // to avoid another provider with the same email can't auth again
      if (error.errorCode === "InvalidFirebaseCredential") {
        if (error.firebaseUID) {
          await admin.auth().deleteUser(error.firebaseUID);
        }
      }

      return res
        .status(error.statusCode)
        .json({ message: error.message, errorCode: error.errorCode });
    }

    // Other errors
    console.log(`PATH: ${req.path}\n\n`, error);

    return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
  };
};

export default errorHandler;
