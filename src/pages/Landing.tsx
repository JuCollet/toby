import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import { Page } from "../components/Page";
import { useLandingInfoDialog } from "./components/useLandingInfoDialog";

export const Landing = () => {
  const { t } = useTranslation();
  const { onLandingNextButtonPressed, dialog } = useLandingInfoDialog();

  return (
    <Page>
      <div className="flex flex-col flex-1 items-center justify-center gap-8">
        <h2 className="text-6xl font-extrabold leading-none text-center">
          {t("landing.hero")}
        </h2>
        <Button size="lg" onClick={onLandingNextButtonPressed}>
          {t("common.letsDoIt")}
        </Button>
      </div>
      {dialog}
    </Page>
  );
};
