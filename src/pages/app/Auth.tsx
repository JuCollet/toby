import { useGoogleDriveConfigFile } from "@/services/query/useGoogleDrive";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

export const Auth = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { data, isLoading } = useGoogleDriveConfigFile();

  useEffect(() => {
    if (data?.language && data?.language != language) {
      changeLanguage(data.language);
    }
  }, [data, language, changeLanguage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <LoaderCircle size="1rem" className="animate-spin" />
        <h1>{t("auth.pendingLabel")}</h1>
      </div>
    );
  }

  if (data === null && !isLoading) {
    return <Navigate to="/app/settings" state={{ init: true }} replace />;
  }

  return <Navigate to="/app/dashboard" replace />;
};
