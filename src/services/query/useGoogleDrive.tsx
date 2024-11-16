import { useQuery } from "react-query";

import { GoogleDriveClient } from "../client/google/drive";
import { useFetch } from "../hooks/useFetch";
import { queryKeys } from "./keys";

export const useGoogleDriveFiles = () => {
  const { fetch } = useFetch();
  const { getFiles } = new GoogleDriveClient(fetch);

  return useQuery({
    queryFn: getFiles,
    queryKey: queryKeys.driveFiles(),
  });
};

export const useGoogleDriveFile = ({ fileId }: { fileId?: string }) => {
  const { fetch } = useFetch();
  const { getFile } = new GoogleDriveClient(fetch);

  return useQuery({
    queryFn: () => getFile({ fileId: fileId ?? "" }),
    queryKey: queryKeys.diveFile(fileId ?? ""),
    enabled: Boolean(fileId),
  });
};

export const useGoogleDriveConfigFile = () => {
  const { fetch } = useFetch();
  const { getConfigFile } = new GoogleDriveClient(fetch);

  return useQuery({
    queryFn: getConfigFile,
    queryKey: queryKeys.driveConfigFile(),
  });
};

export const useGoogleDriveDataFile = () => {
  const { fetch } = useFetch();
  const { getDataFile } = new GoogleDriveClient(fetch);

  return useQuery({
    queryFn: getDataFile,
    queryKey: queryKeys.driveDataFile(),
  });
};
