import jwt from "jsonwebtoken";
import { describe } from "@jest/globals";
import { AudioVolumeType, LoopModeType, SupportedLocaleType } from "@joytify/shared-types/types";
import {
  AccessTokenPayload,
  AccessTokenSignOptions,
  RefreshTokenPayload,
  RefreshTokenSignOptions,
  signToken,
  UserPreferenceSignOptions,
  UserPreferenceTokenPayload,
  VerificationTokenPayload,
  VerificationTokenSignOptions,
  verifyToken,
} from "../../../src/utils/jwt.util";

describe("JWT Utilities", () => {
  const mockAccessPayload: AccessTokenPayload = {
    sessionId: "session123",
    userId: "user123",
    firebaseUserId: "firebase123",
  };

  const mockRefreshPayload: RefreshTokenPayload = {
    sessionId: "session123",
  };

  const mockUserPreferencePayload: UserPreferenceTokenPayload = {
    sidebarCollapsed: false,
    locale: "en-US" as SupportedLocaleType,
    player: {
      shuffle: false,
      loop: "none" as LoopModeType,
      volume: 0.8 as AudioVolumeType,
      playbackQueue: { queue: [], currentIndex: 0 },
    },
  };

  const mockVerificationPayload: VerificationTokenPayload = {
    sessionId: "session123",
  };

  describe("signToken", () => {
    it.each([
      [
        "AccessToken",
        mockAccessPayload,
        AccessTokenSignOptions,
        (decoded: any, mock: any) => {
          expect(decoded.userId).toBe(mock.userId);
          expect(decoded.sessionId).toBe(mock.sessionId);
          expect(decoded.firebaseUserId).toBe(mock.firebaseUserId);
        },
      ],
      [
        "RefreshToken",
        mockRefreshPayload,
        RefreshTokenSignOptions,
        (decoded: any, mock: any) => {
          expect(decoded.sessionId).toBe(mock.sessionId);
        },
      ],
      [
        "UserPreference",
        mockUserPreferencePayload,
        UserPreferenceSignOptions,
        (decoded: any, mock: any) => {
          expect(decoded.sidebarCollapsed).toBe(mock.sidebarCollapsed);
          expect(decoded.locale).toBe(mock.locale);
          expect(decoded.player).toEqual(mock.player);
        },
      ],
      [
        "Verification",
        mockVerificationPayload,
        VerificationTokenSignOptions,
        (decoded: any, mock: any) => {
          expect(decoded.sessionId).toBe(mock.sessionId);
        },
      ],
    ])(
      "should generate valid JWT token for %s payload type",
      (name, payload, options, validateContent) => {
        const token = signToken(payload, options);

        expect(typeof token).toBe("string");
        expect(token.split(".")).toHaveLength(3);

        const decoded = jwt.decode(token) as any;
        validateContent?.(decoded, payload);
        expect(decoded.aud).toEqual(["user"]);
      }
    );

    it.each([
      ["AccessToken", mockAccessPayload, AccessTokenSignOptions, 15 * 60], // 15m
      ["RefreshToken", mockRefreshPayload, RefreshTokenSignOptions, 30 * 24 * 60 * 60], // 30d
      ["UserPreference", mockUserPreferencePayload, UserPreferenceSignOptions, 30 * 24 * 60 * 60], // 30d
      ["Verification", mockVerificationPayload, VerificationTokenSignOptions, 10 * 60], // 10m
    ])(
      "should generate valid JWT token with correct expiration time for %s payload type (±1min tolerance)",
      (name, payload, options, expiresIn) => {
        const token = signToken(payload, options);

        const decoded = jwt.decode(token) as any;
        const now = Date.now() / 1000;
        const minExpectedExp = now + (expiresIn - 1 * 60);
        const maxExpectedExp = now + (expiresIn + 1 * 60);

        expect(decoded.exp).toBeGreaterThan(minExpectedExp);
        expect(decoded.exp).toBeLessThan(maxExpectedExp);
      }
    );
  });

  describe("verifyToken", () => {
    it.each([
      ["AccessToken", mockAccessPayload, AccessTokenSignOptions, 15 * 60], // 15m
      ["RefreshToken", mockRefreshPayload, RefreshTokenSignOptions, 30 * 24 * 60 * 60], // 30d
      ["UserPreference", mockUserPreferencePayload, UserPreferenceSignOptions, 30 * 24 * 60 * 60], // 30d
      ["Verification", mockVerificationPayload, VerificationTokenSignOptions, 10 * 60], // 10m
    ])(
      "should verify a valid JWT token for %s payload type",
      async (name, payload, options, expiresIn) => {
        const token = signToken(payload, options);
        const decoded = await verifyToken(token, options);

        const now = Date.now() / 1000;
        const minExpectedExp = now + (expiresIn - 1 * 60);
        const maxExpectedExp = now + (expiresIn + 1 * 60);

        expect(decoded.error).toBeUndefined();
        expect(decoded.payload).toBeDefined();

        // only validate payload, not jwt other properties, so use "toMatchObject"
        expect(decoded.payload).toMatchObject(payload);

        expect((decoded.payload as any).aud).toEqual(["user"]);
        expect((decoded.payload as any).exp).toBeGreaterThan(minExpectedExp);
        expect((decoded.payload as any).exp).toBeLessThan(maxExpectedExp);
      }
    );

    it("should return error for invalid token", async () => {
      const invalidToken = "invalid.token.here";

      const result = await verifyToken(invalidToken, {
        secret: AccessTokenSignOptions.secret,
      });

      expect(result.error).toBeDefined();
      expect(result.payload).toBeUndefined();
    });

    it("should return error for token with wrong secret", async () => {
      const token = signToken(mockAccessPayload, AccessTokenSignOptions);

      const result = await verifyToken(token, {
        secret: "wrong-secret",
      });

      expect(result.error).toBeDefined();
      expect(result.payload).toBeUndefined();
    });

    it("should handle undefined token", async () => {
      const result = await verifyToken(undefined, {
        secret: AccessTokenSignOptions.secret,
      });

      expect(result.error).toBeUndefined();
      expect(result.payload).toBeUndefined();
    });

    it("should handle expired token", async () => {
      const expiredOptions = {
        ...AccessTokenSignOptions,
        expiresIn: 1, // 1 second to make it expired
      };

      const expiredToken = signToken(mockAccessPayload, expiredOptions);

      // await 2 seconds to ensure token is expired
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await verifyToken(expiredToken, {
        secret: AccessTokenSignOptions.secret,
      });

      expect(result.error).toBeDefined();
      expect(result.error).toContain("expired");
    });
  });
});
