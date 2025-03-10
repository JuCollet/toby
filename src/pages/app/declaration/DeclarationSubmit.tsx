import { Page } from "@/components/Page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthProvider";
import {
  useGoogleDriveConfigFile,
  useGoogleDriveDataFile,
} from "@/services/query/useGoogleDrive";
import { useSendEmail } from "@/services/query/useSendEmail";
import { useStoreGoogleDriveAppFile } from "@/services/query/useStoreGoogleDriveAppFile";
import { Copy, File, Save, Send } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { DeclarationContext } from "./Declaration";

export const DeclarationSubmit = () => {
  const { t } = useTranslation();
  const { permissions } = useContext(AuthContext);
  const { data: userSettings } = useGoogleDriveConfigFile();
  const { data: userData } = useGoogleDriveDataFile();
  const navigate = useNavigate();
  const { b64Document, declarationRows, periods } =
    useContext(DeclarationContext);
  const {
    mutate: send,
    message,
    subject,
    filename,
    recipient,
  } = useSendEmail({ userSettings, periods });
  const { mutate: save, isLoading } = useStoreGoogleDriveAppFile({
    fileName: "data",
    onSuccess: () => navigate("/app/dashboard"),
  });

  const canSendEmail = permissions?.includes("gmail");

  const onSubmit = ({
    enableEmailSend = true,
  }: {
    enableEmailSend?: boolean;
  } = {}) => {
    const shouldSendEmail = b64Document && enableEmailSend;

    if (shouldSendEmail) {
      send({ b64PDF: b64Document });
    }

    const newData = periods.map((period) => {
      const [year, month] = period.split("/");
      return {
        periods,
        date: new Date().toISOString(),
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        declarationRows,
        isEmailSent: Boolean(shouldSendEmail),
        filename,
      };
    });

    const body: typeof userData = {
      ...userData,
      declarations: [...(userData?.declarations ?? []), ...newData],
    };
    save({ data: JSON.stringify(body) });
  };

  return (
    <Page
      isLoading={isLoading}
      title={t("declaration.send.title")}
      footer={
        <div className="flex flex-1 justify-end gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/app/declaration/pay")}
          >
            {t("common.back")}
          </Button>
          {!canSendEmail && (
            <Button
              size="lg"
              className="flex flex-row items-center gap-2"
              onClick={() => navigator.clipboard.writeText(message)}
              variant="secondary"
            >
              <Copy size="1rem" />
              {t("declaration.send.clipboard.buttonLabel")}
            </Button>
          )}
          <Button
            size="lg"
            className="flex flex-row items-center gap-2"
            onClick={() => onSubmit({ enableEmailSend: false })}
            variant={canSendEmail ? "secondary" : undefined}
          >
            <Save size="1rem" />
            {t("common.save")}
          </Button>
          {canSendEmail && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button size="lg" className="flex flex-row items-center gap-2">
                  <Send size="1rem" />
                  {t("declaration.send.footer.submitButtonLabel")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("declaration.send.footer.submitWarning.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("declaration.send.footer.submitWarning.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onSubmit()}>
                    {t("declaration.send.footer.sendButtonLabel")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      }
    >
      <div className="flex flex-col flex-1 items-center justify-center gap-8 rounded-md bg-neutral-100">
        <div className="border border-neutral-100 w-3/4 p-8 rounded-md drop-shadow-xl	bg-white">
          <span>
            <b>{t("declaration.send.email.recipientLabel")}</b> {recipient}
          </span>
          <br />
          <span>
            <b>{t("declaration.send.email.subjectLabel")}</b> {subject}
          </span>
          <br />
          <br />
          <span>
            {message}
            <br />
            <br />
            <span className="flex flex-row items-center align-center gap-1 text-sm text-neutral-500">
              <File size={16} /> {filename}
            </span>
          </span>
        </div>
      </div>
    </Page>
  );
};
