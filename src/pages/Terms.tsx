import { LanguageSelect } from "@/components/LanguageSelect";
import { TermsAndConditions } from "@/components/legals/TermsAndConditions";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Page } from "../components/Page";

export const Terms = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Page
      header={<LanguageSelect />}
      footer={
        <div className="flex flex-1 flex-row gap-4 justify-start">
          <Button size="lg" onClick={() => navigate("/")} variant="outline">
            {t("common.back")}
          </Button>
        </div>
      }
    >
      <TermsAndConditions />
    </Page>
  );
};
