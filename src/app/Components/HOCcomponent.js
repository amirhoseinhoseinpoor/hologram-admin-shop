"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function withPageAuthRequired(WrappedComponent) {
  return function WithPageAuthRequired(props) {
    const authState = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
      // wait until the saved session has been restored before deciding
      if (authState.authReady && !authState.token) {
        router.replace("/");
      }
    }, [authState.authReady, authState.token, router]);

    if (!authState.authReady || !authState.token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
