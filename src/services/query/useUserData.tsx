import { DeclarationRow } from "@/pages/app/declaration/Declaration";

import { useGoogleDriveAppFile } from "./useGoogleDriveAppFile";
import { useGoogleDriveAppFiles } from "./useGoogleDriveAppFiles";

type ManualSubmission = {
  manual: true;
};

export type AppSubmission = {
  declarationRows: DeclarationRow[];
  isEmailSent: boolean;
  filename: string;
};

export const isAppSubmission = (
  submission: Submission,
): submission is AppSubmission => "isEmailSent" in submission;

export type Submission = ManualSubmission | AppSubmission;

export type Declaration = {
  periods: string[];
  year: number;
  month: number;
  date: string;
} & Submission;

export type UserData = {
  declarations: Declaration[];
};

export const useUserData = () => {
  const { data, isLoading: isLoadingFiles } = useGoogleDriveAppFiles();
  const fileId = data?.files?.find((file) => file.name === "data")?.id;

  const {
    data: userFile,
    isLoading: isLoadingFile,
    ...rest
  } = useGoogleDriveAppFile({
    fileId,
  });

  return {
    data: userFile as UserData,
    fileId,
    isLoading: isLoadingFile || isLoadingFiles,
    ...rest,
  };
};
