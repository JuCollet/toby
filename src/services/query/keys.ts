export const queryKeys = {
  driveFiles: () => ["DRIVE_FILES"],
  diveFile: (fileId: string) => ["DRIVE_FILE", fileId],
  driveConfigFile: () => ["DRIVE_CONFIG_FILE"],
  driveDataFile: () => ["DRIVE_DATA_FILE"],
};
