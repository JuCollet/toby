import { LanguageSelect } from "@/components/LanguageSelect";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Page } from "../components/Page";
import { useLandingInfoDialog } from "./components/useLandingInfoDialog";

export const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { onLandingNextButtonPressed, dialog } = useLandingInfoDialog();

  const onTCSButtonClick = useCallback(() => navigate("/terms"), [navigate]);

  return (
    <Page
      header={<LanguageSelect />}
      footer={
        <>
          <Button variant="link" onClick={onTCSButtonClick} className="pl-0">
            {t("landing.footer.links.tcs")}
          </Button>
        </>
      }
    >
      <div className="grid md:grid-cols-5">
        <div className="flex flex-col flex-1 items-center md:items-start justify-center gap-8 md:col-span-2	md:col-start-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-none">
            {t("landing.hero")}
          </h2>
          <Button size="lg" onClick={onLandingNextButtonPressed}>
            {t("common.letsDoIt")}
          </Button>
        </div>
        <div className="hidden md:flex flex-col flex-1 items-start justify-center col-span-3 col-start-3">
          <img src="/assets/img/doc-checks.svg" />
        </div>
      </div>
      {dialog}
    </Page>
  );
};
