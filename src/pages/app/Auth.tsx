import { useUserConfig } from "@/services/query/useUserConfig";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { useGoogleDriveAppFiles } from "../../services/query/useGoogleDriveAppFiles";

export const Auth = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { data, isLoading } = useGoogleDriveAppFiles();
  const { data: userConfig } = useUserConfig();

  useEffect(() => {
    if (userConfig?.language && userConfig?.language != language) {
      changeLanguage(userConfig.language);
    }
  }, [userConfig, language, changeLanguage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <LoaderCircle size="1rem" className="animate-spin" />
        <h1>{t("auth.pendingLabel")}</h1>
      </div>
    );
  }

  if (
    data?.files?.length === 0 ||
    !data?.files.find((file) => file.name === "config")
  ) {
    return <Navigate to="/app/settings" state={{ init: true }} replace />;
  }

  return <Navigate to="/app/dashboard" replace />;
};
