import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SigninCredentialsSchema } from "../login/types";
import {
  BlueButton,
  PrimaryButton,
  RedButton,
  Layout,
  SecondaryButton,
  LinkButton,
} from "../components/base";
import { TextInput } from "../components/base";

type LoginCredentials = {
  email: string;
  username: string;
  password: string;
};

export default function login() {
  const { register, handleSubmit } = useForm<LoginCredentials>();
  const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data));
  });

  // form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Layout>
      <div className="w-full px-4 flex flex-col text-center space-y-12 mx-auto">
        <h1 className="font-display font-bold leading-tight text-5xl text-black-600">
          Welcome.
        </h1>
        <div>
          <BlueButton className="w-full">
            <div className="flex flex-row space-x-2 justify-center items-center">
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </div>
          </BlueButton>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-neutral-400"></div>
            <span className="flex-shrink mx-4 text-neutral-400">
              Or, sign in with your email
            </span>
            <div className="flex-grow border-t border-neutral-400"></div>
          </div>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Username"
              type="username"
              placeholder="Username123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Very$ecureP4ssword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-row-reverse">
              <LinkButton className="font-light self-end text-neutral-400 hover:border-b-neutral-400">
                Forget password?
              </LinkButton>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <PrimaryButton>Sign in</PrimaryButton>
          <LinkButton className="self-center">Sign up</LinkButton>
        </div>
      </div>
    </Layout>
  );
}
