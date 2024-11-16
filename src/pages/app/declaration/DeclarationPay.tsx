import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useGoogleDriveConfigFile } from "@/services/query/useGoogleDrive";
import { getJoinedPeriod } from "@/utils/date";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

import { DeclarationContext, DeclarationRow } from "./Declaration";

const getTotalAmount = ({
  declarationRows,
}: {
  declarationRows: DeclarationRow[];
}) => declarationRows.reduce((acc, curr) => acc + curr.amount, 0);

export const DeclarationPay = () => {
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { declarationRows, periods } = useContext(DeclarationContext);
  const { data } = useGoogleDriveConfigFile();
  const amount = getTotalAmount({ declarationRows }).toFixed(2);
  const epcData = t("declaration.pay.qrcodePayload", {
    amount,
    niss: data?.niss,
    name: `${data?.lastName} ${data?.firstName}`.toUpperCase(),
    period: getJoinedPeriod({ periods, locale: language }),
  });

  return (
    <Page
      title={t("declaration.pay.title")}
      footer={
        <div className="flex flex-1 flex-row gap-4 justify-end">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/app/declaration/sign")}
          >
            {t("common.back")}
          </Button>
          <Button size="lg" onClick={() => navigate("/app/declaration/submit")}>
            {t("common.next")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col flex-1 items-center justify-center gap-10 bg-neutral-100 rounded-md">
        <div className="p-8 rounded-sm bg-white drop-shadow-xl">
          <QRCode value={epcData} size={200} />
        </div>
        <h3>{t("declaration.pay.qrcodeHint")}</h3>
      </div>
    </Page>
  );
};
