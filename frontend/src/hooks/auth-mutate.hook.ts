import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { useGetAuthUserInfoQuery } from "./user-query.hook";
import { deregisterUserAccount } from "../fetchs/user.fetch";
import { authWithThirdParty, logout, signin, signup } from "../fetchs/auth.fetch";
import { MutationKey, QueryKey } from "../constants/query-client-key.constant";
import { AuthForOptions } from "@joytify/shared-types/constants";
import { LoginRequest, RegisterRequest } from "@joytify/shared-types/types";
import useAuthModalState from "../states/auth-modal.state";
import queryClient from "../config/query-client.config";
import { navigate } from "../lib/navigate.lib";

const { SIGN_IN } = AuthForOptions;

const useAuthCommon = () => {
  const location = useLocation();
  const { authFor, closeAuthModal } = useAuthModalState();

  const redirectPath = location.state?.redirectUrl || "/";

  const { refetch: fetchAuthUserInfo } = useGetAuthUserInfoQuery();

  const clearQueriesData = () => {
    queryClient.setQueryData([QueryKey.GET_AUTH_USER_INFO], null);
    queryClient.setQueryData([QueryKey.GET_USER_PLAYLISTS], null);
  };

  return {
    location,
    authFor,
    redirectPath,
    closeAuthModal,
    fetchAuthUserInfo,
    clearQueriesData,
  };
};

// auth mutation (through email and password)
export const useLocalAuthMutation = (opts: object = {}) => {
  const { authFor, redirectPath, closeAuthModal, fetchAuthUserInfo } = useAuthCommon();

  const mutationKey = authFor === SIGN_IN ? MutationKey.SIGNIN : MutationKey.SIGNUP;

  const mutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: (data: LoginRequest | RegisterRequest) => {
      if (authFor === SIGN_IN) {
        return signin(data as LoginRequest);
      } else {
        return signup(data as RegisterRequest);
      }
    },
    onSuccess: () => {
      // fetch auth user info
      fetchAuthUserInfo();

      // close auth modal
      closeAuthModal();

      // navigate to the route before logout
      navigate(redirectPath, { replace: true });

      // display success message
      toast.success(`${authFor === SIGN_IN ? "Login" : "Registered"} successfully`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...opts,
  });

  return mutation;
};

// auth mutation (through third-party)
export const useThirdPartyAuthMutation = (opts: object = {}) => {
  const { redirectPath, closeAuthModal, fetchAuthUserInfo } = useAuthCommon();

  const mutation = useMutation({
    mutationKey: [MutationKey.THIRD_PARTY_AUTH],
    mutationFn: authWithThirdParty,
    onSuccess: () => {
      // fetch auth user info
      fetchAuthUserInfo();

      // close auth modal
      closeAuthModal();

      // navigate to the route before logout
      navigate(redirectPath, { replace: true });

      // display success message
      toast.success("Login Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...opts,
  });

  return mutation;
};

// logout mutation
export const useLogoutMutation = (opts: object = {}) => {
  const { clearQueriesData } = useAuthCommon();

  const mutation = useMutation({
    mutationKey: [MutationKey.LOGOUT],
    mutationFn: logout,
    onSuccess: () => {
      // clear all queries data
      clearQueriesData();

      // display success message
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
    ...opts,
  });

  return mutation;
};

// deregister mutation
export const useDeregisterMutation = (opts: object = {}) => {
  const { clearQueriesData } = useAuthCommon();

  const mutation = useMutation({
    mutationKey: [MutationKey.DEREGISTER_USER],
    mutationFn: async () => {
      try {
        await deregisterUserAccount();
        await logout();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      // clear all queries data
      clearQueriesData();

      // display success message
      toast.success("Deregister Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
    ...opts,
  });

  return mutation;
};
