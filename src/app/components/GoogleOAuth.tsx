"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@mui/material";

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    await signIn("google", { redirectTo: "/" });
  };

  return (
    <div className="p-5 absolute bg-white rounded-2xl">
      <div className="flex flex-row items-center gap-2">
        {/* <Image src={GoogleIcon} alt="Google Icon" width={50} height={50} /> */}

        <Button onClick={handleGoogleLogin} variant={"outlined"} type="submit">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
