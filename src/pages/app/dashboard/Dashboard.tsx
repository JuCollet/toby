import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useGoogleDriveDataFile } from "@/services/query/useGoogleDrive";
import { useStoreGoogleDriveAppFile } from "@/services/query/useStoreGoogleDriveAppFile";
import { getPeriod } from "@/utils/date";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AppHeader } from "../components/Header";
import { DashboardMonthPicker } from "./components/DashboardMonthPicker";

export const Dashboard = () => {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useGoogleDriveDataFile();
  const { mutate, isLoading: isLoadingStoredFile } = useStoreGoogleDriveAppFile(
    {
      fileName: "data",
    },
  );

  const onMarkAsSubmittedButtonPressed = ({
    year,
    month,
  }: {
    year: number;
    month: number;
  }) => {
    const body: typeof data = {
      ...data,
      declarations: [
        ...(data?.declarations ?? []),
        {
          year,
          month,
          manual: true,
          date: new Date().toISOString(),
          periods: [getPeriod({ year, month })],
        },
      ],
    };
    mutate({ data: JSON.stringify(body) });
    setSelectedPeriods([]);
  };

  return (
    <Page
      isLoading={isLoading || isLoadingStoredFile}
      title={t("dashboard.title")}
      header={<AppHeader />}
      footer={
        <div className="hidden md:block flex flex-1 flex-row justify-end">
          <div className="flex flex-1 flex-row gap-4 justify-end">
            <Button
              size="lg"
              onClick={() => {
                const [year, month] = selectedPeriods[0].split("/");
                onMarkAsSubmittedButtonPressed({
                  year: parseInt(year, 10),
                  month: parseInt(month, 10),
                });
              }}
              disabled={
                !selectedPeriods ||
                !selectedPeriods.length ||
                selectedPeriods.length > 1
              }
              variant="secondary"
            >
              {t("dashboard.footer.tagManualDeclarationButtonLabel")}
            </Button>
            <Button
              size="lg"
              onClick={() =>
                navigate("/app/declaration/create", {
                  state: { selectedPeriods: selectedPeriods.sort() },
                })
              }
              disabled={!selectedPeriods || !selectedPeriods.length}
            >
              {t("dashboard.footer.createDeclarationButtonLabel")}
            </Button>
          </div>
        </div>
      }
    >
      <DashboardMonthPicker
        selectedPeriods={selectedPeriods}
        setSelectedPeriods={setSelectedPeriods}
        userData={data}
      />
    </Page>
  );
};
