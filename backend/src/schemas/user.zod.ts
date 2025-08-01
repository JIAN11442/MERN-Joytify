import { z } from "zod";
import { passwordZodSchema } from "./auth.zod";
import { emailZodSchema, objectIdZodSchema } from "./util.zod";
import { ProfileCollections } from "@joytify/shared-types/constants";

export const userZodSchema = z.object({
  email: emailZodSchema.optional(),
  username: z.string().optional(),
  profileImage: z.string().optional(),
  gender: objectIdZodSchema.optional(),
  country: objectIdZodSchema.optional(),
  dateOfBirth: z.string().optional(),
  monthlyStatistic: z.boolean().optional(),
  followingArtistUpdate: z.boolean().optional(),
  systemAnnouncement: z.boolean().optional(),
});

export const updatePasswordZodSchema = z.object({
  currentPassword: passwordZodSchema,
  newPassword: passwordZodSchema,
});

export const profileCollectionsZodSchema = z.nativeEnum(ProfileCollections);

export const deregisterUserZodSchema = z.object({
  shouldDeleteSongs: z.boolean(),
});
