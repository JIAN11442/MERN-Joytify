import { RequestHandler } from "express";

import UserModel from "../models/user.model";
import {
  getProfileCollectionsInfo,
  getProfileUserInfo,
  resetUserPassword,
  updateUserInfoById,
} from "../services/user.service";
import { objectIdZodSchema, pageZodSchema } from "../schemas/util.zod";
import {
  profileCollectionsZodSchema,
  resetPasswordZodSchema,
  userZodSchema,
} from "../schemas/user.zod";
import { HttpCode } from "@joytify/shared-types/constants";
import { UpdateUserInfoRequest, ResetPasswordRequest } from "@joytify/shared-types/types";
import appAssert from "../utils/app-assert.util";

type ResetPasswordBodyRequest = Omit<ResetPasswordRequest, "token">;

const { OK, INTERNAL_SERVER_ERROR } = HttpCode;

// get authenticated user info handler
export const getAuthenticatedUserInfoHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = objectIdZodSchema.parse(req.userId);

    const user = await UserModel.findById(userId).select("profile_img");

    return res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

// get profile user info handler
export const getProfileUserInfoHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = objectIdZodSchema.parse(req.userId);
    const page = pageZodSchema.parse(req.query.page);

    const user = await getProfileUserInfo(userId, page);

    return res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

// get profile collections info handler
export const getProfileCollectionsInfoHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = objectIdZodSchema.parse(req.userId);
    const page = pageZodSchema.parse(req.query.page);
    const collection = profileCollectionsZodSchema.parse(req.params.collection);

    const { docs } = await getProfileCollectionsInfo(userId, page, collection);

    return res.status(OK).json(docs);
  } catch (error) {
    next(error);
  }
};

// update user handler
export const updateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = objectIdZodSchema.parse(req.userId);
    const params: UpdateUserInfoRequest = userZodSchema.parse(req.body);

    const { user } = await updateUserInfoById({ userId, ...params });

    return res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

// reset user password handler
export const resetPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const token = req.params.token;
    const parsedParams: ResetPasswordBodyRequest = resetPasswordZodSchema.parse(req.body);

    await resetUserPassword({ token, ...parsedParams });

    return res.status(OK).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

// deregister user handler
export const deregisterUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = objectIdZodSchema.parse(req.userId);
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    appAssert(deletedUser, INTERNAL_SERVER_ERROR, "Failed to deregiter user account");

    return res.status(OK).json({ message: "Deregister user account successfully" });
  } catch (error) {
    next(error);
  }
};
