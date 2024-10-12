import { useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useQuery } from "react-query";

type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
};

const BASE_URL = "https://www.googleapis.com/drive/v3/files";

export const useGoogleDriveAppFiles = () => {
  const { token } = useContext(AuthContext);

  const getGoogleDriveFiles = useCallback(async () => {
    const params = new URLSearchParams({
      spaces: "appDataFolder",
    });

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return (await res.json()) as { files: GoogleDriveFile[] };
  }, []);

  return useQuery({
    queryFn: getGoogleDriveFiles,
    queryKey: ["DRIVE_FILES"],
  });
};
