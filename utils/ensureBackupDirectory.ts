import fs from "fs";
// The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.

export const ensureBackupDirectory = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Backup directory created: ${dir}`);
  }
};
