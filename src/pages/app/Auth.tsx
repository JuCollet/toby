import { AuthContext } from "@/context/AuthProvider";
import { useGoogleDriveConfigFile } from "@/services/query/useGoogleDrive";
import { LoaderCircle } from "lucide-react";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { AuthPermissionErrorDialog } from "./components/AuthPermissionErrorDialog";

export const Auth = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { data, isLoading } = useGoogleDriveConfigFile();
  const { permissions } = useContext(AuthContext);

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

  if (!permissions?.includes("drive")) {
    return <AuthPermissionErrorDialog />;
  }

  if (data === null && !isLoading) {
    return <Navigate to="/app/settings" state={{ init: true }} replace />;
  }

  return <Navigate to="/app/dashboard" replace />;
};
