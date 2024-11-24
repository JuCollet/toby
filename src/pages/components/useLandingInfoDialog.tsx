import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LandingInfoDialog,
  LANDING_INFO_DIALOG_STORAGE_KEY,
} from "./LandingInfoDialog";

const lastShownDate = window.localStorage.getItem(
  LANDING_INFO_DIALOG_STORAGE_KEY,
);

export const useLandingInfoDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const onLandingNextButtonPressed = useCallback(() => {
    if (lastShownDate) {
      return navigate("/app/auth");
    }
    setIsDialogOpen(true);
  }, [navigate, setIsDialogOpen]);

  const dialog = useMemo(
    () => (
      <LandingInfoDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    ),
    [isDialogOpen],
  );

  return { onLandingNextButtonPressed, dialog };
};
