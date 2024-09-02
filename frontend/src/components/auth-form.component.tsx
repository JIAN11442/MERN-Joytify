import { useRef } from "react";
import toast from "react-hot-toast";
import { AuthProvider } from "firebase/auth";
import { MdAlternateEmail } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { IoKey } from "react-icons/io5";
import { BsFillQuestionCircleFill } from "react-icons/bs";

import googleLogo from "../images/google.png";
import githubLogo from "../images/github.png";
import Icon from "./react-icons.component";
import Loader from "./loader.component";
import InputBox from "./input-box.component";

import { authWithThirdParty, signin, signup } from "../fetchs/auth.fetch";
import AuthForOptions from "../constants/auth-type.constant";
import { reqAuth } from "../constants/data-type.constant";
import MutationKey from "../constants/mutation-key.constant";
import {
  DefaultsAuthType,
  defaultsLoginData,
  defaultsRegisterData,
} from "../constants/form-default-data.constant";
import FirebaseProvider from "../constants/firebase-provider.constant";
import useAuthModalState from "../states/auth-modal.state";
import useAuthHook from "../hooks/auth.hook";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const { refetch } = useAuthHook();
  const { authFor, openAuthModal, closeAuthModal } = useAuthModalState();

  const SIGN_IN = AuthForOptions.SIGN_IN;
  const SIGN_UP = AuthForOptions.SIGN_UP;

  // redirect path
  const redirectPath = location.state?.redirectUrl || "/";

  // navigate to the other auth modal
  const handleSwitchAuthModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    reset();

    openAuthModal(authFor === SIGN_IN ? SIGN_UP : SIGN_IN);
  };

  // navigate to forgot password page
  const handleNavigateToForgotPasswordPage = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const timeout = setTimeout(() => {
      // change authfor type
      openAuthModal(AuthForOptions.FORGOT_PASSWORD);
    }, 0);

    return () => clearTimeout(timeout);
  };

  // handle input onKeyDown
  const handleMoveToNextElement = (
    e: React.KeyboardEvent<HTMLInputElement>,
    next: React.RefObject<HTMLButtonElement> | reqAuth,
    condition: string | boolean = e.currentTarget.value.length > 0
  ) => {
    if (e.key === "Enter" && condition) {
      if (typeof next === "string") {
        setFocus(next);
      } else if (next?.current) {
        next.current.focus();
      }
    }
  };

  // handle auth with third-party
  const handleAuthWithThirdParty = async (provider: AuthProvider) => {
    authUserWithThirdParty({ provider, authFor });
  };

  // third-party submit text
  const thirdPartySubmitText =
    authFor === SIGN_IN ? "Continue" : authFor.replace("-", " ");

  // auth mutation (through email and password)
  const { mutate: authUser, isPending } = useMutation({
    mutationKey: [MutationKey.AUTH],
    mutationFn: authFor === SIGN_IN ? signin : signup,
    onSuccess: () => {
      closeAuthModal();

      toast.success(
        `${authFor === SIGN_IN ? "Login" : "Registered"} successfully`
      );

      navigate(redirectPath, { replace: true });

      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // auth mutation (through third-party)
  const { mutate: authUserWithThirdParty } = useMutation({
    mutationKey: [MutationKey.THIRD_PARTY_AUTH],
    mutationFn: authWithThirdParty,
    onSuccess: () => {
      closeAuthModal();

      toast.success("Login Successfully");

      navigate(redirectPath, { replace: true });

      // refetch the auth query to refresh the user data
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // get form data
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { isValid },
  } = useForm<DefaultsAuthType>({
    defaultValues:
      authFor === SIGN_IN ? defaultsLoginData : defaultsRegisterData,
    mode: "onChange",
  });

  // watch password value(for validate comfirm password)
  const passwordValue = watch("password");

  // handle form submit
  const onSubmit: SubmitHandler<DefaultsAuthType> = async (value) => {
    authUser(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`
        flex
        flex-col
        gap-3
      `}
    >
      {/* Third-party login method */}
      <div
        className={`
          flex
          flex-col
          gap-3
        `}
      >
        {/* Google */}
        <button
          type="button"
          onClick={() => handleAuthWithThirdParty(FirebaseProvider.GOOGLE)}
          className={`third-party-btn`}
        >
          <img
            src={googleLogo}
            className={`
              w-5
              h-5
            `}
          />
          <p>{thirdPartySubmitText} with Google</p>
        </button>

        {/* Github */}
        <button
          type="button"
          onClick={() => handleAuthWithThirdParty(FirebaseProvider.GITHUB)}
          className={`third-party-btn`}
        >
          <img
            src={githubLogo}
            className={`
              w-6
              h-6
              object-cover
            `}
          />
          <p>{thirdPartySubmitText} with Github</p>
        </button>
      </div>

      {/* Separate line */}
      <div
        className={`
          flex
          items-center
          justify-center
          gap-2
        `}
      >
        <hr className={`separate-line`} />
        <p
          className={`
            text-sm
            text-grey-custom/5
          `}
        >
          OR
        </p>
        <hr className={`separate-line`} />
      </div>

      {/* Email */}
      <div
        className={`
          flex
          flex-col
          gap-2
        `}
      >
        <p
          className={`
            text-sm
            text-grey-custom/50
          `}
        >
          Email address
        </p>

        <InputBox
          id="email"
          type="email"
          placeholder="Your email address"
          icon={MdAlternateEmail}
          onKeyDown={(e) => handleMoveToNextElement(e, "password")}
          {...register("email", { required: true })}
        />
      </div>

      {/* Password */}
      <div
        className={`
          flex
          flex-col
          gap-2
        `}
      >
        <p
          className={`
            text-sm
            text-grey-custom/50
          `}
        >
          Password
        </p>

        <InputBox
          id="password"
          type="password"
          placeholder="Your Password"
          icon={IoKey}
          onKeyDown={(e) =>
            handleMoveToNextElement(
              e,
              authFor === SIGN_IN ? submitBtnRef : "confirmPassword"
            )
          }
          {...register("password", { required: true })}
        />

        <>
          {authFor === SIGN_IN ? (
            <div
              className={`
                  flex
                  items-center
                  justify-end
                  text-sm
                  text-neutral-700
                `}
            >
              <button
                onClick={handleNavigateToForgotPasswordPage}
                className={`
                    flex
                    gap-2
                    items-center
                    justify-center
                    hover:text-green-custom
                    hover:underline
                    transition
                  `}
              >
                <Icon name={BsFillQuestionCircleFill} />
                <p>Forgot password?</p>
              </button>
            </div>
          ) : (
            ""
          )}
        </>
      </div>

      {/* Confirm password */}
      <>
        {authFor !== SIGN_IN ? (
          <div
            className={`
                flex
                flex-col
                gap-2
              `}
          >
            <p
              className={`
                  text-sm
                text-grey-custom/50
                `}
            >
              Confirm Password
            </p>

            <InputBox
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              icon={IoKey}
              onKeyDown={(e) =>
                handleMoveToNextElement(
                  e,
                  submitBtnRef,
                  e.currentTarget.value === passwordValue
                )
              }
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === passwordValue,
              })}
            />
          </div>
        ) : (
          ""
        )}
      </>

      {/* Submit button */}
      <button
        ref={submitBtnRef}
        disabled={!isValid}
        className={`
          mt-2
          submit-btn
          capitalize
          text-sm
          outline-none
          rounded-full
        `}
      >
        {isPending ? (
          <Loader loader={{ size: 20 }} />
        ) : (
          authFor.replace("-", " ")
        )}
      </button>

      {/* Navigate link */}
      <p
        className={`
            text-sm
            text-neutral-600
            text-center
          `}
      >
        {authFor === SIGN_IN
          ? "Don't have an account?"
          : "Already have an account?"}

        <button
          onClick={handleSwitchAuthModal}
          className={`
              ml-2
              text-green-custom
              underline
            `}
        >
          {authFor === SIGN_IN ? "Sign up" : "Sign in"}
        </button>
      </p>
    </form>
  );
};

export default AuthForm;
