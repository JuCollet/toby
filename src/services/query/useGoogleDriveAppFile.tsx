import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../context/AuthProvider";

const getGoogleDriveFile = async ({
  fileId,
  accessToken,
}: {
  fileId?: string;
  accessToken: string;
}): Promise<unknown> => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await res.json();
};

type Props = {
  fileId?: string;
};

export const useGoogleDriveAppFile = ({ fileId }: Props) => {
  const { token } = useContext(AuthContext);

  return useQuery({
    queryFn: () => getGoogleDriveFile({ accessToken: token ?? "", fileId }),
    queryKey: ["DRIVE_FILE", fileId],
    enabled: Boolean(fileId),
  });
};
