import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleAuthLogout } from "@/services/query/useGoogleDriveAuth";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const AuthPermissionErrorDialog = () => {
  const { t } = useTranslation();
  const { mutateAsync: logout } = useGoogleAuthLogout();
  const navigate = useNavigate();

  const onDone = useCallback(() => {
    logout();
    navigate("/");
  }, [navigate, logout]);

  return (
    <Dialog onOpenChange={onDone} open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("auth.permissionErrorDialog.title")}</DialogTitle>
        </DialogHeader>
        <span>{t("auth.permissionErrorDialog.description")}</span>
        <DialogFooter>
          <Button onClick={onDone}>{t("common.ok")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
