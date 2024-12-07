import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Declaration,
  GoogleDriveDataFile,
  isAppSubmission,
} from "@/services/client/google/drive";
import { generatePdf } from "@/services/pdf/generatePDF";
import { useGoogleDriveConfigFile } from "@/services/query/useGoogleDrive";
import { getPeriod } from "@/utils/date";
import clsx from "clsx";
import { saveAs } from "file-saver";
import { Clock, Download, MailCheck, MailMinusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  setSelectedPeriods: Dispatch<SetStateAction<string[]>>;
  selectedPeriods: string[];
  userData?: GoogleDriveDataFile;
};

const isSelectable = ({
  selectedPeriods,
  year,
  month,
}: {
  selectedPeriods: string[];
  year: number;
  month: number;
}) => {
  if (selectedPeriods.length === 2) {
    return false;
  }

  if (selectedPeriods.length === 0) {
    return true;
  }

  return selectedPeriods.some((period) => {
    const [pYear, pMonth] = period.split("/");

    if (
      parseInt(pMonth, 10) === 1 &&
      month === 12 &&
      year === parseInt(pYear, 10) - 1
    ) {
      return true;
    }

    if (
      parseInt(pMonth, 10) === 12 &&
      month === 1 &&
      year === parseInt(pYear, 10) + 1
    ) {
      return true;
    }

    if (
      (month === parseInt(pMonth, 10) - 1 ||
        month === parseInt(pMonth, 10) + 1) &&
      parseInt(pYear, 10) === year
    ) {
      return true;
    }

    return false;
  });
};

const isManuallySubmitted = ({
  userData,
  year,
  month,
}: {
  year: number;
  month: number;
  userData?: GoogleDriveDataFile;
}) =>
  userData?.declarations?.some(
    ({ year: dYear, month: dMonth, ...rest }) =>
      dYear === year && dMonth === month && "manual" in rest,
  );

const getDeclaration = ({
  userData,
  year,
  month,
}: {
  year: number;
  month: number;
  userData?: GoogleDriveDataFile;
}): Declaration | null => {
  const submission = userData?.declarations?.find(
    (submission) =>
      submission.year === year &&
      submission.month === month &&
      "declarationRows" in submission,
  );

  if (submission && isAppSubmission(submission)) {
    return submission;
  }

  return null;
};

export const DashboardMonthPicker = ({
  selectedPeriods,
  setSelectedPeriods,
  userData,
}: Props) => {
  const { data: userSettings } = useGoogleDriveConfigFile();
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const now = new Date();
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const twoMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 2));

  const years = new Array(5)
    .fill(null)
    .map((_, i) => now.getFullYear() - i)
    .reverse();

  const months = new Array(12).fill(null).map((_, i) => i);

  const onClick = useCallback(
    ({ year, month }: { year: number; month: number }) => {
      const period = getPeriod({ year, month });
      const isAlreadyChecked = selectedPeriods.includes(period);

      setSelectedPeriods((periods) => {
        if (isAlreadyChecked) {
          return [...periods].filter((p) => p != period);
        }

        return [...periods, period];
      });
    },
    [selectedPeriods, setSelectedPeriods],
  );

  const onDownloadButtonClick = useCallback(
    async ({ declaration }: { declaration: Declaration }) => {
      if ("declarationRows" in declaration && userSettings) {
        const pdf = await generatePdf({
          declarationRows: declaration.declarationRows,
          userSettings,
          periods: declaration.periods,
        });

        const binary = atob(pdf.replace(/\s/g, ""));
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
        }

        const blob = new Blob([view], { type: "application/pdf" });

        saveAs(blob, declaration.filename);
      }
    },
    [userSettings],
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12">
        {years.map((year) => (
          <div key={year}>
            <h1 className="text-2xl font-bold mb-4">{year}</h1>
            <div className="inline-grid grid-cols-4 w-full gap-4">
              {months.map((index) => {
                const month = index + 1;
                const period = getPeriod({ year, month });
                const declaration = getDeclaration({
                  userData,
                  year,
                  month,
                });

                const _isManuallySubmitted = isManuallySubmitted({
                  userData,
                  year,
                  month,
                });

                const _isSubmitted = Boolean(declaration);

                const isTooEarly =
                  index > now.getMonth() && year >= now.getFullYear();

                const isDisabled =
                  (!selectedPeriods?.includes(period) &&
                    !isSelectable({
                      selectedPeriods: selectedPeriods,
                      year,
                      month,
                    })) ||
                  _isSubmitted ||
                  _isManuallySubmitted ||
                  isTooEarly;

                const isSelected = selectedPeriods?.includes(period);

                const isLastCall =
                  !isSelected &&
                  !_isManuallySubmitted &&
                  !_isSubmitted &&
                  index === twoMonthsAgo.getMonth() &&
                  year === twoMonthsAgo.getFullYear();

                const isDeclarationTime =
                  !isSelected &&
                  !_isManuallySubmitted &&
                  !_isSubmitted &&
                  index === lastMonth.getMonth() &&
                  year === lastMonth.getFullYear();

                const tooltipMessage = (function () {
                  if (_isManuallySubmitted) {
                    return t(
                      "dashboard.monthPicker.tooltips.manuallySubmitted",
                    );
                  }

                  if (isDeclarationTime) {
                    return t("dashboard.monthPicker.tooltips.timeToSubmit");
                  }

                  if (isLastCall) {
                    return t("dashboard.monthPicker.tooltips.lastCallToSubmit");
                  }

                  return null;
                })();

                return (
                  <TooltipProvider key={month}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Popover>
                          <PopoverTrigger className="w-full" asChild>
                            <div
                              className={clsx(
                                "flex items-center justify-center w-full h-8 rounded-3xl border text-center text-xs transition-all",
                                {
                                  ["bg-amber-500"]: isDeclarationTime,
                                  ["hover:bg-amber-600"]: isDeclarationTime,
                                  ["bg-rose-500"]: isLastCall,
                                  ["hover:bg-rose-600"]: isLastCall,
                                  ["bg-teal-400"]: _isManuallySubmitted,
                                  ["bg-teal-600"]: _isSubmitted,
                                  ["text-white"]:
                                    _isManuallySubmitted ||
                                    _isSubmitted ||
                                    isSelected ||
                                    isLastCall ||
                                    isDeclarationTime,
                                  ["bg-neutral-900"]: isSelected,
                                  ["cursor-pointer"]:
                                    !isDisabled || _isSubmitted,
                                  ["cursor-default"]: isDisabled,
                                  ["text-neutral-600"]:
                                    !isDisabled && !isSelected,
                                  ["hover:bg-neutral-100"]:
                                    !isDisabled &&
                                    !isSelected &&
                                    !isLastCall &&
                                    !isDeclarationTime,
                                  ["text-neutral-200"]: isDisabled,
                                  ["border-0"]:
                                    isDisabled || selectedPeriods.length === 0,
                                },
                              )}
                              onClick={
                                !isDisabled
                                  ? () => onClick({ year, month })
                                  : undefined
                              }
                            >
                              {new Date(year, index, 1)
                                .toLocaleString(language, {
                                  month: "short",
                                })
                                .toUpperCase()}
                            </div>
                          </PopoverTrigger>
                          {declaration && isAppSubmission(declaration) && (
                            <PopoverContent>
                              <div className="flex flex-col gap-2 p-2">
                                <div className="flex items-center gap-2">
                                  <Clock size="1rem" />
                                  <span className="text-sm">
                                    {new Date(declaration.date).toLocaleString(
                                      "language",
                                    )}
                                  </span>
                                </div>
                                {declaration && (
                                  <div className="flex items-center gap-2">
                                    {declaration.isEmailSent ? (
                                      <MailCheck size="1rem" />
                                    ) : (
                                      <MailMinusIcon size="1rem" />
                                    )}
                                    <span className="text-sm">
                                      {declaration.isEmailSent
                                        ? t(
                                            "dashboard.monthPicker.submitted.emailSent",
                                          )
                                        : t(
                                            "dashboard.monthPicker.submitted.emailNotSent",
                                          )}
                                    </span>
                                  </div>
                                )}
                                <Button
                                  className="flex gap-2 mt-2"
                                  onClick={() =>
                                    onDownloadButtonClick({ declaration })
                                  }
                                >
                                  <Download size="1rem" />
                                  {t("common.download")}
                                </Button>
                              </div>
                            </PopoverContent>
                          )}
                        </Popover>
                      </TooltipTrigger>
                      {tooltipMessage && (
                        <TooltipContent>
                          <p>{tooltipMessage}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
