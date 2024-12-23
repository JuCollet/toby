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
import { generatePdf } from "@/services/pdf/generatePDF";
import { useGoogleDriveConfigFile } from "@/services/query/useGoogleDrive";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { DeclarationSignDialog } from "./components/DeclarationSignDialog";
import { DeclarationContext } from "./Declaration";

export const DeclarationSign = () => {
  const [isSignOpen, setIsSignOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { declarationRows, b64Signature, periods, b64Document, setDocument } =
    useContext(DeclarationContext);
  const { data: userSettings } = useGoogleDriveConfigFile();

  useEffect(() => {
    if (userSettings) {
      (async () => {
        const doc = await generatePdf({
          declarationRows,
          userSettings,
          periods,
          b64signature: b64Signature,
        });
        if (typeof doc === "string") {
          setDocument({ b64Document: doc });
        }
      })();
    }
  }, [userSettings, b64Signature, declarationRows, periods, setDocument]);

  return (
    <Page
      isLoading={b64Document == null}
      title={t("declaration.sign.title")}
      footer={
        <div className="flex flex-1 flex-row gap-4 justify-end">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/app/declaration/create")}
          >
            {t("common.back")}
          </Button>
          {b64Signature ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                  {t("declaration.sign.pay.buttonLabel")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("declaration.sign.pay.warning.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("declaration.sign.pay.warning.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => navigate("/app/declaration/pay")}
                  >
                    {t("common.continue")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              size="lg"
              onClick={() => setIsSignOpen(true)}
              className="w-full md:w-auto"
            >
              {t("common.sign")}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex-1 rounded-md overflow-hidden">
        {b64Document && (
          <iframe
            className="flex-1 w-full h-full"
            src={`data:application/pdf;base64,${b64Document}#toolbar=0&scrollbar=0&navpanes=0`}
            title="TOB Document"
          />
        )}
        <DeclarationSignDialog open={isSignOpen} onOpenChange={setIsSignOpen} />
      </div>
    </Page>
  );
};
