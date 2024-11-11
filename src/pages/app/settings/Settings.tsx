import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useStoreGoogleDriveAppFile } from "@/services/query/useStoreGoogleDriveAppFile";
import { useUserConfig } from "@/services/query/useUserConfig";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { SettingsForm } from "./components/SettingsForm";

export const Settings = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { state } = useLocation();
  const { data, isLoading, fileId } = useUserConfig();
  const navigate = useNavigate();
  const { mutateAsync, isLoading: isSaving } = useStoreGoogleDriveAppFile({
    fileName: "config",
    onSuccess: () => {
      if (state?.init) {
        navigate("/app/dashboard");
      }
    },
  });

  return (
    <Page
      title={t("settings.title")}
      isLoading={isLoading}
      footer={
        <>
          <div className="flex justify-end gap-4 flex-1">
            {!state?.init && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/app/dashboard")}
              >
                {t("common.back")}
              </Button>
            )}
            <Button
              size="lg"
              type="submit"
              form="settings"
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving && <Loader2 size="1rem" className="animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </>
      }
    >
      <SettingsForm
        defaultValues={{ ...data, language }}
        fileId={fileId}
        onSubmit={mutateAsync}
      />
    </Page>
  );
};
