import ConnectSDK from "@useparagon/connect/ConnectSDK";
import { useCallback, useEffect, useState } from "react";

let paragon: ConnectSDK | undefined;

export default function useParagon(paragonUserToken: string) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof paragon === "undefined") {
      paragon = new ConnectSDK();
    }
  }, []);

  const [user, setUser] = useState(paragon ? paragon.getUser() : null);
  const [error, setError] = useState();

  const updateUser = useCallback(async () => {
    if (!paragon) {
      return;
    }
    const authedUser = paragon.getUser();
    if (authedUser.authenticated) {
      setUser({ ...authedUser });
    }
  }, []);

  // Listen for account state changes
  useEffect(() => {
    // @ts-ignore
    paragon.subscribe("onIntegrationInstall", updateUser);
    // @ts-ignore
    paragon.subscribe("onIntegrationUninstall", updateUser);
    return () => {
      // @ts-ignore
      paragon.unsubscribe("onIntegrationInstall", updateUser);
      // @ts-ignore
      paragon.unsubscribe("onIntegrationUninstall", updateUser);
    };
  }, []);

  useEffect(() => {
    if (!error && paragon) {
      paragon.authenticate(
        process.env.NEXT_PUBLIC_PARAGON_PROJECT_ID!,
        paragonUserToken
      )
        .then(updateUser)
        .catch(setError);
    }
  }, [error, paragonUserToken]);

  return {
    paragon,
    user,
    error,
    updateUser,
  };
}
