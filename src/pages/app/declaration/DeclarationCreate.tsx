import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { DeclarationCreateTable } from "./components/DeclarationCreateTable";
import { DeclarationContext } from "./Declaration";

export const DeclarationCreate = () => {
  const { t } = useTranslation();
  const { declarationRows } = useContext(DeclarationContext);
  const navigate = useNavigate();

  return (
    <Page
      title={t("declaration.create.title")}
      footer={
        <div className="flex flex-1 flex-row gap-4 justify-end">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/app/dashboard")}
          >
            {t("common.back")}
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/app/declaration/sign")}
            disabled={declarationRows.length === 0}
            className="w-full md:w-auto"
          >
            {t("common.next")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 gap-4">
        <DeclarationCreateTable />
      </div>
    </Page>
  );
};
