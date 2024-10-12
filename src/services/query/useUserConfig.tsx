import { useGoogleDriveAppFile } from "./useGoogleDriveAppFile";
import { useGoogleDriveAppFiles } from "./useGoogleDriveAppFiles";

export type UserSettings = {
  firstName: string;
  lastName: string;
  locality: string;
  niss: string;
  street: string;
  streetNo: string;
  zipCode: string;
  language: string;
};

export const useUserConfig = () => {
  const { data } = useGoogleDriveAppFiles();
  const fileId = data?.files?.find((file) => file.name === "config")?.id;

  const { data: userFile, ...rest } = useGoogleDriveAppFile({
    fileId,
  });

  return {
    data: userFile as UserSettings,
    fileId,
    ...rest,
  };
};
