import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Page } from "../components/Page";

export const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Page>
      <div className="flex flex-col flex-1 items-center justify-center gap-8">
        <h2 className="text-6xl font-extrabold leading-none text-center">
          {t("landing.hero")}
        </h2>
        <Button size="lg" onClick={() => navigate("/app/auth")}>
          {t("common.letsDoIt")}
        </Button>
      </div>
    </Page>
  );
};
