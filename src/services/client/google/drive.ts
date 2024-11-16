import { DeclarationRow } from "@/pages/app/declaration/Declaration";

import { BaseClass } from "../baseClass";

type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
};

export type GoogleDriveConfigFile = {
  firstName: string;
  lastName: string;
  locality: string;
  niss: string;
  street: string;
  streetNo: string;
  zipCode: string;
  language: string;
  fileId: string;
};

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

export type GoogleDriveDataFile = {
  declarations: Declaration[];
};

const BASE_URL = "https://www.googleapis.com/drive/v3/files";

export class GoogleDriveClient extends BaseClass {
  constructor(fetchFn: typeof fetch) {
    super(fetchFn, BASE_URL);
  }

  getFiles = async (): Promise<{ files: GoogleDriveFile[] }> => {
    const params = new URLSearchParams({
      spaces: "appDataFolder",
    });

    const response = await this.request(`?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  };

  getFile = async <T = unknown>({ fileId }: { fileId: string }): Promise<T> => {
    const response = await this.request(`/${fileId}?alt=media`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  };

  getConfigFile = async (): Promise<GoogleDriveConfigFile> => {
    const res = await this.getFiles();

    if (!res.files) {
      throw new Error("No files");
    }

    const fileId = res?.files.find((file) => file.name === "config")?.id;

    if (!fileId) {
      throw new Error("No config file found");
    }

    const fileContent = await this.getFile<GoogleDriveConfigFile>({ fileId });

    return { ...fileContent, fileId };
  };

  getDataFile = async (): Promise<GoogleDriveDataFile> => {
    const res = await this.getFiles();

    if (!res.files) {
      throw new Error("No files");
    }

    const fileId = res?.files.find((file) => file.name === "data")?.id;

    if (!fileId) {
      throw new Error("No data file found");
    }

    return this.getFile({ fileId });
  };
}
