import { nanoid } from "nanoid";
import mongoose, { UpdateQuery } from "mongoose";

import AlbumModel from "./album.model";
import LabelModel from "./label.model";
import SessionModel from "./session.model";
import PlaylistModel, { PlaylistDocument } from "./playlist.model";
import VerificationModel from "./verification.model";

import usePalette from "../hooks/paletee.hook";
import { profile_collections, profile_names } from "../constants/profile-img.constant";
import { HttpCode, PrivacyOptions } from "@joytify/shared-types/constants";
import { HexPaletee } from "@joytify/shared-types/types";
import { compareHashValue, hashValue } from "../utils/bcrypt.util";
import { deleteAwsFileUrlOnModel } from "../utils/aws-s3-url.util";
import appAssert from "../utils/app-assert.util";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  profile_img: string;
  verified: boolean;
  auth_for_third_party: boolean;
  paletee: HexPaletee;
  playlists: mongoose.Types.ObjectId[];
  songs: mongoose.Types.ObjectId[];
  albums: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  account_info: {
    total_playlists: number;
    total_songs: number;
    total_albums: number;
    total_following: number;
  };
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword(): Omit<this, "password">;
}

const { INTERNAL_SERVER_ERROR } = HttpCode;
const profileImgBaseUrl = "https://api.dicebear.com/6.x";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String },
    username: { type: String, unique: true, required: true },
    profile_img: {
      type: String,
      default: () =>
        `${profileImgBaseUrl}/${
          profile_collections[Math.floor(Math.random() * profile_collections.length)]
        }/svg?seed=${profile_names[Math.floor(Math.random() * profile_names.length)]}`,
    },
    verified: { type: Boolean, default: false, required: true },
    auth_for_third_party: { type: Boolean, default: false },
    paletee: {
      vibrant: { type: String },
      darkVibrant: { type: String },
      lightVibrant: { type: String },
      muted: { type: String },
      darkMuted: { type: String },
      lightMuted: { type: String },
    },
    playlists: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Playlist",
      index: true,
    },
    songs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Song",
      index: true,
    },
    albums: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Album",
      index: true,
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Musician",
      index: true,
    },
    account_info: {
      total_playlists: { type: Number, default: 0 },
      total_songs: { type: Number, default: 0 },
      total_albums: { type: Number, default: 0 },
      total_following: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// before create user, ...
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  this.username = `${this.username}?nanoid=${nanoid(5)}`;

  if (this.profile_img) {
    this.paletee = await usePalette(this.profile_img);
  }

  return next();
});

// after created user, ...
userSchema.post("save", async function (doc) {
  const { id } = doc;

  try {
    // check if default playlist already exists
    const existDefaultPlaylist = await PlaylistModel.findOne({
      user: id,
      default: true,
    });

    // only create default playlist if it doesn't exist
    // cause this.save() will trigger this post middleware again -> infinite loop
    if (!existDefaultPlaylist) {
      const defaultCoverImg =
        "https://mern-joytify-bucket-yj.s3.ap-northeast-1.amazonaws.com/defaults/liked-song.png";

      const paletee = await usePalette(defaultCoverImg);

      // create default playlist
      const defaultPlaylist = await PlaylistModel.create({
        user: id,
        title: "Liked Songs",
        description: "All your liked songs will be here",
        cover_image: defaultCoverImg,
        paletee: paletee,
        default: true,
        privacy: PrivacyOptions.PRIVATE,
      });

      appAssert(defaultPlaylist, INTERNAL_SERVER_ERROR, "Failed to create default playlist");
    }
  } catch (error) {
    console.log(error);
  }
});

// before updated user, ...
userSchema.pre("findOneAndUpdate", async function (next) {
  const findQuery = this.getQuery();
  let updateDoc = this.getUpdate() as UpdateQuery<UserDocument>;

  // if the profile image is modified, update the paletee
  if (updateDoc.profile_img) {
    const originalDoc = await UserModel.findById(findQuery);
    const paletee = await usePalette(updateDoc.profile_img);

    updateDoc.paletee = paletee;

    // if the original document is not default image, delete it AWS
    if (originalDoc && !originalDoc?.profile_img.includes(profileImgBaseUrl)) {
      await deleteAwsFileUrlOnModel(originalDoc.profile_img);
    }
  }

  // if the username is modified, generate a new nanoid
  if (updateDoc.username) {
    updateDoc.username = `${updateDoc.username}?nanoid=${nanoid(5)}`;
  }

  next();
});

// before deleted user, ...
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const findQuery = this.getQuery();
    const userId = findQuery._id;
    const user = await UserModel.findById(userId);
    const playlists = await PlaylistModel.find({ user: user?._id });

    //  * delete all user playlists and their associated properties
    //  * using individual deletions instead of deleteMany() to trigger middleware hooks
    //  * this ensures proper cleanup of related properties (e.g., songs) through schema lifecycle methods
    if (playlists) {
      await Promise.all(
        playlists.map((playlist: PlaylistDocument) => PlaylistModel.findByIdAndDelete(playlist._id))
      );
    }

    if (user) {
      // remove user ID from each relate album's "users" property
      await AlbumModel.updateMany({ users: userId }, { $pull: { users: userId } });

      // remove user ID from each relate label's "users" property
      await LabelModel.updateMany({ users: userId }, { $pull: { users: userId } });

      // if the original document is not default image, delete it from AWS
      if (!user.profile_img.includes(profileImgBaseUrl)) {
        await deleteAwsFileUrlOnModel(user.profile_img);
      }

      // delete all relative sessions
      await SessionModel.deleteMany({ user: user?.id });

      // delete all relative verification codes
      await VerificationModel.deleteMany({ email: user?.email });
    }

    next();
  } catch (error) {
    console.log(error);
  }
});

// custom method (compare password with hashed password from database)
userSchema.methods.comparePassword = async function (password: string) {
  return compareHashValue(password, this.password);
};

// custom method (omit password from user object)
userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
