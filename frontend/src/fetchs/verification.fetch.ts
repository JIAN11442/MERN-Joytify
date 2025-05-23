import API from "../config/api-client.config";
import {
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from "@joytify/shared-types/types";

// send verification code
export const sendVerificationCode = async (params: SendCodeRequest): Promise<SendCodeResponse> =>
  API.post("/verification/send/code", params);

// verify verification code
export const verifyVerificationCode = async (
  params: VerifyCodeRequest
): Promise<VerifyCodeResponse> => API.post("/verification/verify/code", params);

// send verification link
export const sendResetPasswordEmail = async (email: string) =>
  API.post("/verification/send/link", { email });

// verify reset password link
export const verifyResetPasswordLink = async (token: string) =>
  API.get(`/verification/verify/link/${token}`);
