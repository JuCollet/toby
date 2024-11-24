import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose(): void;
};

export const LANDING_INFO_DIALOG_STORAGE_KEY = "landingInfoDialogLastShownDate";

export const LandingInfoDialog = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onNextButtonPressed = useCallback(() => {
    window.localStorage.setItem(
      LANDING_INFO_DIALOG_STORAGE_KEY,
      new Date().toISOString(),
    );
    navigate("/app/auth");
  }, [navigate]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("landing.infoDialog.title")}</DialogTitle>
        </DialogHeader>
        <span>{t("landing.infoDialog.description")}</span>
        <div className="flex flex-col gap-4 mt-4 mb-6">
          {[
            {
              title: t("landing.infoDialog.drive.title"),
              titleSuffix: t("landing.infoDialog.drive.titleSuffix"),
              description: t("landing.infoDialog.drive.descripton"),
            },
            {
              title: t("landing.infoDialog.gmail.title"),
              titleSuffix: t("landing.infoDialog.gmail.titleSuffix"),
              description: t("landing.infoDialog.gmail.descripton"),
            },
          ].map(({ title, titleSuffix, description }) => (
            <div className="flex gap-2" key={title}>
              <div className="p-0.5">
                <CheckCircle size="1.25rem" className="text-emerald-600" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold">{title}</h3>
                  <span>{titleSuffix}</span>
                </div>
                <span className="text-sm">{description}</span>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onNextButtonPressed}>
            {t("landing.infoDialog.ctaLabel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
