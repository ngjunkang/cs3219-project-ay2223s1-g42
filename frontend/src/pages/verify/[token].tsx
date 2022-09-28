import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { PrimaryButton, LoadingLayout, NormalHeading } from "src/components";
import { ApiResponse } from "src/login";
import { Axios } from "src/services";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [verifyRes, setVerifyRes] = useState<string | undefined>(undefined);

  const isSuccess = verifyRes === "success";

  useEffect(() => {
    const fetchVerify = async () => {
      try {
        const res = await Axios.post<ApiResponse>(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        ).then((resp) => resp.data);
        setVerifyRes(res.message);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchVerify();
  }, [token]);

  return (
    <>
      {loading ? (
        <LoadingLayout />
      ) : (
        <div className="px-4 flex flex-col text-center gap-8">
          <NormalHeading>
            {isSuccess
              ? "Email verification is successful!"
              : "Email verification failed! Please sign up again"}
          </NormalHeading>
          <PrimaryButton
            onClick={() => (isSuccess ? navigate("/") : navigate("/signup"))}
          >
            {isSuccess ? "Log in" : "Sign up"}
          </PrimaryButton>
        </div>
      )}
    </>
  );
};

export default VerifyEmailPage;
