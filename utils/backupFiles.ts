import { readdir, rm, rmdir } from "node:fs/promises";
import path from "path";

const backupDir = path.resolve("./backups");
const mongoDir = path.resolve("./backup")

export const removeBackupFile = async (name: string) => {
  const files = await readdir(backupDir);
  const backupFile = files.find((file: any) => file.startsWith(name)) as string;
  if (!backupFile) {
    return;
  }
  const filePath = path.join(backupDir, backupFile);
  console.log(filePath);
  await rm(filePath, { recursive: true });
  return "Successfully removed current backup file.";
};

export const removeBackupDir = async (name: string) => {
  const files = await readdir(mongoDir);
  const backupFile = files.find((file: any) => file.startsWith(name)) as string;
  if (!backupFile) {
    return;
  }
  const filePath = path.join(mongoDir, backupFile);
  console.log(filePath);
  await rm(filePath, { recursive: true });
  return "Successfully removed current backup file.";
};

export const getBackupFile = async (name: string) => {
  //Tie it to the name
  const files = await readdir(backupDir);
  const backupFile = files.find((file: string) => file.startsWith(name));

  if (!backupFile) {
    throw new Error("Backup file not found");
  }
  // return the file
  return path.join("./backups", backupFile);
};

export const getBackupDirectory = async (name: string) => {
  //Tie it to the name
  const files = await readdir(mongoDir);
  const backupFile = files.find((file: string) => file.startsWith(name));

  if (!backupFile) {
    throw new Error("Backup file not found");
  }
  // return the file
  return `./backup/${backupFile}`;
};
