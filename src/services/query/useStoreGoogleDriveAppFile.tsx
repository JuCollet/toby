import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { AuthContext } from "../../context/AuthProvider";

async function uploadFileToDrive({
  accessToken,
  data,
  fileName,
  fileId,
}: {
  accessToken: string;
  data: string;
  fileName: string;
  fileId?: string;
}) {
  var fileName = fileName;
  var contentType = "text/plain";
  var metadata = {
    name: fileName,
    mimeType: contentType,
    ...(!fileId && { parents: ["appDataFolder"] }),
  };

  const boundary = "boundary";
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: " +
    contentType +
    "\r\n\r\n" +
    data +
    "\r\n" +
    close_delim;

  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files${
      fileId ? `/${fileId}` : ""
    }?uploadType=multipart`,
    {
      method: fileId ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  return response.json();
}

export const useStoreGoogleDriveAppFile = ({
  fileName,
  onSuccess,
}: {
  fileName: "config" | "data";
  onSuccess?: () => void;
}) => {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, fileId }: { data: string; fileId?: string }) =>
      uploadFileToDrive({ accessToken: token ?? "", data, fileId, fileName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DRIVE_FILES"] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
